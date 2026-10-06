import nodemailer, { Transporter } from 'nodemailer';

export interface SendPasswordResetOptions {
  toEmail: string;
  recipientName?: string;
  resetCode: string;
  resetToken: string;
  resetUrl: string;
}

export interface SendPasswordChangedOptions {
  toEmail: string;
  recipientName?: string;
}

let cachedTransporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

  // 1. Real Production SMTP (Gmail, SendGrid, Amazon SES, Mailgun, Postmark, cPanel, etc.)
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });

      // Verify connection once
      await transporter.verify();
      console.log(`[LORÉA Email] Connected successfully to SMTP server: ${smtpHost}:${smtpPort}`);
      cachedTransporter = transporter;
      return cachedTransporter;
    } catch (err: any) {
      console.error('[LORÉA Email] Failed to connect to configured SMTP, falling back to development transport:', err.message);
    }
  }

  // 2. Fallback for Preview / Sandbox Environments (Ethereal or JSON transport)
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`[LORÉA Email] Initialized Ethereal sandbox test account for: ${testAccount.user}`);
    cachedTransporter = testTransporter;
    return cachedTransporter;
  } catch (err: any) {
    // 3. Resilient fallback stream
    console.warn('[LORÉA Email] Using direct JSON stream transporter');
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true,
    });
    return cachedTransporter;
  }
}

export async function sendPasswordResetEmail(options: SendPasswordResetOptions): Promise<{ success: boolean; previewUrl?: string | false }> {
  const { toEmail, recipientName = 'Cherished Client', resetCode, resetToken, resetUrl } = options;
  const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || '"LORÉA Haute Couture" <concierge@loreaofficial.com>';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LORÉA — Password Reset</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F7F4EF; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1D1D1B; }
    .container { max-width: 580px; margin: 40px auto; background-color: #FFFFFF; border: 1px solid #EAE5DE; }
    .header { background-color: #151413; padding: 36px 24px; text-align: center; border-bottom: 2px solid #BA945A; }
    .logo { color: #FAF8F5; font-family: "Playfair Display", Georgia, serif; font-size: 26px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; }
    .tagline { color: #BA945A; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 6px; }
    .content { padding: 40px 36px; }
    .greeting { font-size: 15px; font-weight: 500; color: #1D1D1B; margin-bottom: 16px; }
    .message { font-size: 13px; line-height: 1.7; color: #55514D; margin-bottom: 28px; }
    .code-box { background-color: #F7F4EF; border: 1px solid #EAE5DE; border-left: 3px solid #BA945A; padding: 20px; text-align: center; margin-bottom: 30px; }
    .code-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #7C746B; margin-bottom: 8px; font-family: monospace; }
    .code-value { font-family: "Courier New", Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.2em; color: #1D1D1B; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #1D1D1B; color: #F7F4EF !important; text-decoration: none; padding: 14px 32px; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 600; border-radius: 0px; }
    .security-notice { background-color: #FAF8F5; border: 1px dashed #D6CEC5; padding: 16px; font-size: 11px; line-height: 1.6; color: #7C746B; margin-top: 24px; }
    .footer { background-color: #151413; padding: 24px; text-align: center; font-size: 10px; color: #8F877F; letter-spacing: 0.15em; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">LORÉA</h1>
      <div class="tagline">Atelier Cairo · Haute Couture</div>
    </div>
    <div class="content">
      <div class="greeting">Dear ${recipientName},</div>
      <div class="message">
        We received a request to reset the password for your LORÉA client account (<strong>${toEmail}</strong>). To proceed with securing your account, please use the 6-digit verification code below:
      </div>
      
      <div class="code-box">
        <div class="code-label">One-Time Recovery Code</div>
        <div class="code-value">${resetCode}</div>
      </div>

      <div class="message" style="text-align: center;">
        Or click the secure button below to set your new password directly:
      </div>

      <div class="button-container">
        <a href="${resetUrl}" class="button" target="_blank">Reset Password Now →</a>
      </div>

      <div class="security-notice">
        <strong>Security Advisory:</strong>
        <br>• This code and link will expire in <strong>60 minutes</strong> for your security.
        <br>• Never share this recovery code with anyone. LORÉA staff will never ask for your recovery code.
        <br>• If you did not initiate this request, your account remains secure and you may safely disregard this message.
      </div>
    </div>
    <div class="footer">
      LORÉA Atelier Cairo · 14 Hassan Sabry Street, Zamalek, Cairo · Egypt<br>
      Private & Confidential
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
LORÉA — Haute Couture Atelier Cairo
Password Reset Request

Dear ${recipientName},

We received a request to reset the password for your LORÉA account (${toEmail}).

Your One-Time Recovery Code: ${resetCode}

Or reset your password directly using this secure link:
${resetUrl}

This code and link are valid for 60 minutes.
If you did not request a password reset, please disregard this email.

LORÉA Atelier Cairo
concierge@loreaofficial.com
  `.trim();

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `LORÉA Atelier — Password Recovery Code: ${resetCode}`,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`[LORÉA Email] Dispatched password reset email to ${toEmail}. Message ID: ${info.messageId}`);
    if (previewUrl) {
      console.log(`[LORÉA Email] Ethereal Web Preview: ${previewUrl}`);
    }

    return { success: true, previewUrl };
  } catch (err: any) {
    console.error(`[LORÉA Email] Error sending reset email to ${toEmail}:`, err);
    return { success: false };
  }
}

export async function sendPasswordChangedEmail(options: SendPasswordChangedOptions): Promise<boolean> {
  const { toEmail, recipientName = 'Cherished Client' } = options;
  const fromAddress = process.env.SMTP_FROM || process.env.EMAIL_FROM || '"LORÉA Haute Couture" <concierge@loreaofficial.com>';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #F7F4EF; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1D1D1B; }
    .container { max-width: 580px; margin: 40px auto; background-color: #FFFFFF; border: 1px solid #EAE5DE; }
    .header { background-color: #151413; padding: 32px 24px; text-align: center; border-bottom: 2px solid #BA945A; }
    .logo { color: #FAF8F5; font-family: "Playfair Display", Georgia, serif; font-size: 24px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0; }
    .content { padding: 36px; }
    .message { font-size: 13px; line-height: 1.7; color: #55514D; }
    .footer { background-color: #151413; padding: 20px; text-align: center; font-size: 10px; color: #8F877F; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">LORÉA</h1>
    </div>
    <div class="content">
      <p>Dear ${recipientName},</p>
      <p class="message">
        This is a confirmation that the password for your LORÉA account (<strong>${toEmail}</strong>) was successfully updated on ${new Date().toUTCString()}.
      </p>
      <p class="message" style="color: #964036;">
        If you did not perform this update, please contact our atelier concierge immediately at <a href="mailto:concierge@loreaofficial.com" style="color: #BA945A;">concierge@loreaofficial.com</a> or +20 100 892 4410.
      </p>
    </div>
    <div class="footer">
      LORÉA Atelier Cairo · Zamalek, Cairo, Egypt
    </div>
  </div>
</body>
</html>
  `;

  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: 'LORÉA Atelier — Your Password Has Been Updated',
      html: htmlContent,
      text: `Your LORÉA account password for ${toEmail} has been updated. If you did not make this change, please contact concierge@loreaofficial.com immediately.`,
    });
    return true;
  } catch (err) {
    console.error(`[LORÉA Email] Failed to send password changed notification:`, err);
    return false;
  }
}
