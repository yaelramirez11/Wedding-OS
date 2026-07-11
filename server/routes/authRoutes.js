const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const {
  registerHandler,
  loginHandler,
  meHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);
router.get("/me", authMiddleware, meHandler);

module.exports = router;
