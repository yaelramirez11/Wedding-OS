const {
  registerUser,
  loginUser,
  getUserById,
  requestPasswordReset,
  resetPassword,
} = require("../services/authService");

const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/authValidator");

const registerHandler = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await registerUser(validatedData);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const meHandler = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const forgotPasswordHandler = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    await requestPasswordReset(email);

    res.json({
      message:
        "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

const resetPasswordHandler = async (req, res, next) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    await resetPassword(validatedData);

    res.json({
      message: "Password updated successfully. You can sign in now.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerHandler,
  loginHandler,
  meHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
};
