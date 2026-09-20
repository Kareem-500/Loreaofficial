import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  generateAuthToken,
  AuthenticatedRequest,
  rateLimitAuth,
} from '../auth';

const router = Router();

// Register new customer account
router.post('/register', rateLimitAuth(8, 10 * 60 * 1000), (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      dateOfBirth,
      country = 'Egypt',
      city = 'Cairo',
      governorate = 'Cairo',
      address,
      agreeTerms,
      marketingConsent,
    } = req.body;

    // Validation
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return res.status(422).json({ error: 'First and last name are required.' });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(422).json({ error: 'Please enter a valid email address.' });
    }

    if (!agreeTerms) {
      return res.status(422).json({ error: 'You must agree to the Terms & Conditions and Privacy Policy.' });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ error: 'Passwords do not match.' });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return res.status(422).json({ error: strength.message });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in or reset your password.' });
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userUuid = crypto.randomUUID();
    const customerId = `cust_${userId}`;
    const passwordHash = hashPassword(password);

    // Insert user
    db.prepare(`
      INSERT INTO users (id, uuid, email, password_hash, role, status, email_verified)
      VALUES (?, ?, ?, ?, 'customer', 'active', 0)
    `).run(userId, userUuid, normalizedEmail, passwordHash);

    // Insert customer record
    db.prepare(`
      INSERT INTO customers (id, user_id, first_name, last_name, phone, date_of_birth, country, city)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(customerId, userId, firstName.trim(), lastName.trim(), phone ? phone.trim() : null, dateOfBirth || null, country, city);

    // Insert customer profile
    db.prepare(`
      INSERT INTO customer_profiles (id, customer_id, marketing_consent)
      VALUES (?, ?, ?)
    `).run(`prof_${userId}`, customerId, marketingConsent ? 1 : 0);

    // Insert wishlist record
    db.prepare(`
      INSERT INTO wishlists (id, customer_id, user_id)
      VALUES (?, ?, ?)
    `).run(`wish_${userId}`, customerId, userId);

    // If initial address was provided, save it
    if (address && address.trim()) {
      db.prepare(`
        INSERT INTO addresses (id, customer_id, full_name, phone, governorate, city, street, building_number, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `).run(
        `addr_${Date.now()}`,
        customerId,
        `${firstName.trim()} ${lastName.trim()}`,
        phone || '',
        governorate,
        city,
        address.trim(),
        '1'
      );
    }

    // Generate email verification token (valid for 48 hours)
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    db.prepare(`
      INSERT INTO email_verifications (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(`ev_${Date.now()}`, userId, verifyToken, expiresAt);

    // Generate JWT token
    const token = generateAuthToken({
      userId,
      uuid: userUuid,
      email: normalizedEmail,
      role: 'customer',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    res.cookie('lorea_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'Registration successful. Welcome to LORÉA.',
      token,
      ...(process.env.ENABLE_PREVIEW_TOKENS === 'true' && process.env.NODE_ENV !== 'production'
        ? { verificationToken: verifyToken }
        : {}),
      user: {
        id: userId,
        uuid: userUuid,
        email: normalizedEmail,
        role: 'customer',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailVerified: false,
        phone: phone || null,
        city,
        country,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
  }
});

// Login
router.post('/login', rateLimitAuth(10, 15 * 60 * 1000), (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email address and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare(`
      SELECT id, uuid, email, password_hash, role, status, email_verified
      FROM users
      WHERE email = ?
    `).get(normalizedEmail) as any;

    // Constant-time check protection: do not reveal email existence
    if (!user || !comparePassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email address or password. Please try again.' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ error: 'This account has been disabled. Please contact LORÉA concierge.' });
    }

    // Update last login
    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Fetch customer or admin profile details
    let firstName = 'Valued';
    let lastName = 'Client';
    let phone = '';
    let permissions: string[] = [];

    if (user.role === 'customer') {
      const cust = db.prepare('SELECT first_name, last_name, phone FROM customers WHERE user_id = ?').get(user.id) as any;
      if (cust) {
        firstName = cust.first_name;
        lastName = cust.last_name;
        phone = cust.phone || '';
      }
    } else {
      const admin = db.prepare(`
        SELECT a.name, a.role_id, a.department
        FROM admins a
        WHERE a.user_id = ?
      `).get(user.id) as any;

      if (admin) {
        firstName = admin.name;
        lastName = `(${admin.department || 'Operations'})`;
      }

      // Fetch role permissions
      const permRows = db.prepare('SELECT permission_code FROM role_permissions WHERE role_id = ?').all(`role_${user.role}`) as any[];
      permissions = permRows.map((r) => r.permission_code);
    }

    const token = generateAuthToken({
      userId: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      firstName,
      lastName,
    });

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    res.cookie('lorea_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
    });

    return res.json({
      message: 'Sign-in successful.',
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        role: user.role,
        firstName,
        lastName,
        phone,
        emailVerified: Boolean(user.email_verified),
        permissions,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Sign-in failed. Please try again shortly.' });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('lorea_token');
  return res.json({ message: 'Successfully signed out.' });
});

// Current authenticated user session verification
router.get('/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.json({ user: null });
  }

  const user = db.prepare(`
    SELECT id, uuid, email, role, status, email_verified, created_at, last_login_at
    FROM users
    WHERE id = ?
  `).get(req.user.userId) as any;

  if (!user || user.status === 'disabled') {
    res.clearCookie('lorea_token');
    return res.json({ user: null });
  }

  let customerDetails: any = null;
  let adminDetails: any = null;
  let permissions: string[] = [];

  if (user.role === 'customer') {
    customerDetails = db.prepare(`
      SELECT c.*, p.avatar_url, p.gender, p.bio, p.marketing_consent
      FROM customers c
      LEFT JOIN customer_profiles p ON p.customer_id = c.id
      WHERE c.user_id = ?
    `).get(user.id);
  } else {
    adminDetails = db.prepare(`
      SELECT a.*, r.name as role_name
      FROM admins a
      JOIN roles r ON r.id = a.role_id
      WHERE a.user_id = ?
    `).get(user.id);

    const permRows = db.prepare('SELECT permission_code FROM role_permissions WHERE role_id = ?').all(`role_${user.role}`) as any[];
    permissions = permRows.map((r) => r.permission_code);
  }

  return res.json({
    user: {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      emailVerified: Boolean(user.email_verified),
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
      firstName: customerDetails?.first_name || adminDetails?.name || 'User',
      lastName: customerDetails?.last_name || '',
      customer: customerDetails,
      admin: adminDetails,
      permissions,
    },
  });
});

// Forgot password
router.post('/forgot-password', rateLimitAuth(5, 15 * 60 * 1000), (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Please provide your email address.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail) as any;

    let previewResetToken: string | null = null;

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      db.prepare(`
        INSERT INTO password_reset_tokens (id, user_id, token, expires_at, used)
        VALUES (?, ?, ?, ?, 0)
      `).run(`pr_${Date.now()}`, user.id, resetToken, expiresAt);

      if (process.env.ENABLE_PREVIEW_TOKENS === 'true' && process.env.NODE_ENV !== 'production') {
        previewResetToken = resetToken;
      }
    }

    // Always respond with the same message to avoid user enumeration
    return res.json({
      message: 'If that email address is registered with LORÉA, a password reset link has been dispatched to your inbox.',
      ...(previewResetToken ? { previewResetToken } : {}),
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Unable to process password reset request.' });
  }
});

// Reset password with token
router.post('/reset-password', rateLimitAuth(10, 15 * 60 * 1000), (req: Request, res: Response) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Password reset token is required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(422).json({ error: 'Passwords do not match.' });
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return res.status(422).json({ error: strength.message });
    }

    // Check token
    const tokenRow = db.prepare(`
      SELECT id, user_id, expires_at, used
      FROM password_reset_tokens
      WHERE token = ?
    `).get(token) as any;

    if (!tokenRow || tokenRow.used === 1) {
      return res.status(400).json({ error: 'This password reset link is invalid or has already been used.' });
    }

    const isExpired = new Date(tokenRow.expires_at).getTime() < Date.now();
    if (isExpired) {
      return res.status(400).json({ error: 'This password reset link has expired. Please request a new one.' });
    }

    const newHash = hashPassword(newPassword);

    // Update password & invalidate token
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, tokenRow.user_id);
    db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?').run(tokenRow.id);

    return res.json({ message: 'Your password has been successfully updated. You may now sign in with your new password.' });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Unable to reset password. Please try again.' });
  }
});

// Verify email with token
router.post('/verify-email', (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required.' });
    }

    const verifyRow = db.prepare(`
      SELECT id, user_id, expires_at, verified_at
      FROM email_verifications
      WHERE token = ?
    `).get(token) as any;

    if (!verifyRow) {
      return res.status(400).json({ error: 'Invalid verification token.' });
    }

    if (verifyRow.verified_at) {
      return res.json({ message: 'Email is already verified.', verified: true });
    }

    const isExpired = new Date(verifyRow.expires_at).getTime() < Date.now();
    if (isExpired) {
      return res.status(400).json({ error: 'Verification token has expired. Please request a new verification email.' });
    }

    // Update verified status
    db.prepare('UPDATE users SET email_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(verifyRow.user_id);
    db.prepare('UPDATE email_verifications SET verified_at = CURRENT_TIMESTAMP WHERE id = ?').run(verifyRow.id);

    return res.json({ message: 'Your email address has been successfully verified.', verified: true });
  } catch (err: any) {
    console.error('Verify email error:', err);
    return res.status(500).json({ error: 'Email verification failed.' });
  }
});

// Resend verification
router.post('/resend-verification', (req: AuthenticatedRequest, res: Response) => {
  try {
    const email = req.body.email || req.user?.email;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const user = db.prepare('SELECT id, email_verified FROM users WHERE email = ?').get(email.trim().toLowerCase()) as any;
    if (!user) {
      return res.json({ message: 'If registered, a verification link has been resent.' });
    }

    if (user.email_verified) {
      return res.json({ message: 'This email is already verified.', verified: true });
    }

    const newToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO email_verifications (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(`ev_${Date.now()}`, user.id, newToken, expiresAt);

    return res.json({
      message: 'Verification link resent successfully.',
      ...(process.env.ENABLE_PREVIEW_TOKENS === 'true' && process.env.NODE_ENV !== 'production'
        ? { previewToken: newToken }
        : {}),
    });
  } catch (err: any) {
    console.error('Resend verification error:', err);
    return res.status(500).json({ error: 'Failed to resend verification.' });
  }
});

export default router;
