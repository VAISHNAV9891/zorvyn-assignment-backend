import nodemailer from 'nodemailer';

export let transporter;

if (process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 2525,
    secure: true,
    auth: {
      user: "apikey", 
      pass: process.env.SENDGRID_API_KEY,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export const sendMailService = async (data, to, purpose) => {
  try {
    let subject, text, html;
    const brandName = "Finance Control System";
    const brandColor = "#1e3a8a"; // Deep Business Blue

    if (purpose === 'RESET_PASSWORD') {
      const resetLink = data; 
      subject = `🔒 Password Reset Request - ${brandName}`;

      text = `Hello,\n\nWe received a request to reset the password for your ${brandName} account.\n\nReset Link: ${resetLink}\n\nThis link is valid for 15 minutes.\n\nRegards,\n${brandName} Security Team`;

      html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
            <h2 style="color: ${brandColor}; margin: 0; letter-spacing: 1px;">${brandName}</h2>
          </div>
          <div style="padding: 30px 0; text-align: center;">
            <h3 style="color: #334155; margin-top: 0; font-size: 22px;">Secure Password Reset</h3>
            <p style="color: #64748b; font-size: 16px; line-height: 1.6; text-align: left;">
              Hello, we received a request to reset your account password. Access to your financial dashboard is protected. Please click the button below to proceed.
            </p>
            <div style="margin: 35px 0;">
              <a href="${resetLink}" style="background-color: ${brandColor}; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
                Reset My Password
              </a>
            </div>
            <div style="background-color: #fefce8; padding: 15px; border-left: 4px solid #eab308; margin: 20px 0; text-align: left;">
              <p style="margin: 0; color: #854d0e; font-size: 14px;">
                <strong>Security Alert:</strong> This link expires in 15 minutes. If you didn't request this, please ignore this email to keep your current credentials.
              </p>
            </div>
          </div>
          <div style="padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              &copy; 2026 ${brandName}. Automated Security System.
            </p>
          </div>
        </div>
      `;
    } else if (purpose === 'EMAIL_VERIFY') {
      const verificationLink = data; 
      subject = `🚀 Verify Your Identity - ${brandName}`;

      text = `Welcome to ${brandName}!\n\nPlease verify your email to activate your financial control dashboard:\n\n${verificationLink}\n\nRegards,\nTeam ${brandName}`;

      html = `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #f1f5f9;">
            <h2 style="color: ${brandColor}; margin: 0;">${brandName}</h2>
          </div>
          <div style="padding: 30px 0; text-align: center;">
            <h3 style="color: #0f172a; font-size: 24px;">Activate Your Account 🎉</h3>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for choosing ${brandName}. To ensure the security of your financial data, please verify your email address.
            </p>
            <div style="margin: 35px 0;">
              <a href="${verificationLink}" style="background-color: #059669; color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
          </div>
          <div style="text-align: center; color: #94a3b8; font-size: 12px;">
            This link is valid for 24 hours.
          </div>
        </div>
      `;
    } else if (purpose === 'TWO_FACTOR_AUTH') {
      subject = `🔑 2FA Security Code - ${brandName}`;
      html = `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; background-color: #ffffff;">
          <h2 style="color: ${brandColor}; text-align: center; margin-bottom: 25px;">Verification Code</h2>
          <p style="color: #475569; font-size: 16px;">Enter this code to authorize your login to ${brandName}:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; font-size: 36px; font-weight: bold; color: ${brandColor}; letter-spacing: 8px; padding: 15px 30px; background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px;">
              ${data}
            </div>
          </div>
          <p style="font-size: 14px; color: #64748b; text-align: center;">Valid for 5 minutes only.</p>
        </div>
      `;
    } else if (purpose === 'SECURE_ACCOUNT') {
      subject = `🚨 URGENT: Security Alert - ${brandName}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 2px solid #fee2e2; border-radius: 12px; background-color: #fffafb;">
          <div style="text-align: center; border-bottom: 1px solid #fecaca; padding-bottom: 15px;">
            <h2 style="color: #dc2626; margin: 0;">SECURITY ALERT</h2>
          </div>
          <div style="padding: 20px 0;">
            <p style="font-weight: bold; font-size: 18px; color: #111827;">Your password was recently changed.</p>
            <p style="color: #4b5563;">If you did not authorize this change, your financial account is at high risk. Click below immediately to freeze all access.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data}" style="background-color: #dc2626; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                LOCK MY ACCOUNT NOW
              </a>
            </div>
          </div>
        </div>
      `;
    }

    const info = await transporter.sendMail({
      from: process.env.SENDGRID_FROM,
      to: to,
      subject,
      text,
      html
    });

    return true;
  } catch (error) {
    console.error("Mail service error:", error.message);
    return false;
  }
};

