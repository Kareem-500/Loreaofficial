import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';

const configuredJwtSecret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
if (!configuredJwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET or JWT_SECRET must be configured in production.');
}
const JWT_SECRET = configuredJwtSecret || 'development-only-lorea-jwt-secret';
const TOKEN_EXPIRY = '7d';

export interface AuthUserPayload {
  userId: string;
  uuid: string;
  email: string;
  role: 'customer' | 'admin' | 'super_admin' | 'manager' | 'support';
  firstName?: string;
  lastName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

// Password utilities
export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters in length.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must include at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must include at least one numeric digit.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must include at least one special character.' };
  }
  return { valid: true };
}

// Token generation
export function generateAuthToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyAuthToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch {
    return null;
  }
}

// Extract token from cookie or Authorization header
export function extractToken(req: Request): string | null {
  if (req.cookies && req.cookies.lorea_token) {
    return req.cookies.lorea_token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Authentication middleware
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return next();
  }

  // Verify user still exists and is active in database
  const userRow = db.prepare('SELECT id, uuid, email, role, status FROM users WHERE id = ?').get(payload.userId) as any;
  if (!userRow || userRow.status === 'disabled') {
    return next();
  }

  req.user = {
    userId: userRow.id,
    uuid: userRow.uuid,
    email: userRow.email,
    role: userRow.role,
  };

  next();
}

// Require authenticated user
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in to continue.' });
  }
  next();
}

// Require admin or specific roles
export function requireRoles(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions.' });
    }
    next();
  };
}

// Require specific permission from RBAC table
export function requirePermission(permissionCode: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (req.user.role === 'super_admin') {
      return next();
    }

    // Check role_permissions table
    const roleId = `role_${req.user.role}`;
    const hasPerm = db.prepare(`
      SELECT 1 FROM role_permissions
      WHERE role_id = ? AND permission_code = ?
    `).get(roleId, permissionCode);

    if (!hasPerm) {
      return res.status(403).json({ error: `Access denied: missing permission '${permissionCode}'.` });
    }
    next();
  };
}

// Admin activity logging
export function logAdminActivity(
  adminId: string,
  adminName: string,
  action: string,
  resource: string,
  resourceId?: string,
  beforeState?: any,
  afterState?: any,
  ipAddress?: string
) {
  try {
    const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    db.prepare(`
      INSERT INTO admin_activity_logs (id, admin_id, admin_name, action, resource, resource_id, before_state, after_state, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      adminId,
      adminName,
      action,
      resource,
      resourceId || null,
      beforeState ? JSON.stringify(beforeState) : null,
      afterState ? JSON.stringify(afterState) : null,
      ipAddress || null
    );
  } catch (err) {
    console.error('Failed to write admin activity log:', err);
  }
}

// In-memory rate limiter for auth brute-force prevention
const rateLimitMap = new Map<string, { attempts: number; resetTime: number }>();

export function rateLimitAuth(maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { attempts: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.attempts >= maxAttempts) {
      return res.status(429).json({
        error: 'Too many authentication attempts. For your security, please try again in a few minutes.',
      });
    }

    entry.attempts += 1;
    next();
  };
}
