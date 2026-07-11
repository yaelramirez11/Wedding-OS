const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { sendPasswordResetEmail } = require("../lib/email");
const { createError } = require("../lib/errors");
const prisma = require("../lib/prisma");
const { claimOrphanData } = require("./claimOrphanData");

const BCRYPT_ROUNDS = 12;

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
});

const createToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );

const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError("An account with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await claimOrphanData(user.id);

  const token = createToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createError("Invalid email or password", 401);
  }

  const token = createToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
};

const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  return sanitizeUser(user);
};

const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return;
  }

  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const resetUrl = `${clientUrl}/reset-password?token=${token}`;

  await sendPasswordResetEmail({
    email: user.email,
    resetUrl,
  });
};

const resetPassword = async ({ token, password }) => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    throw createError("Invalid or expired reset link", 400);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    }),
  ]);
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
};
