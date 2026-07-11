const nodemailer = require("nodemailer");

const isEmailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM,
  );

const getTransporter = () => {
  if (!isEmailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log("[WeddingOS] Password reset link (email not configured):");
    console.log(resetUrl);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your WeddingOS password",
    text: `Reset your WeddingOS password using this link (valid for 1 hour):\n\n${resetUrl}`,
    html: `<p>Reset your WeddingOS password using this link (valid for 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
};

module.exports = {
  sendPasswordResetEmail,
  isEmailConfigured,
};
