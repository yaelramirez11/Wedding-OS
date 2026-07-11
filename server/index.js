require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authMiddleware = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const { authLimiter, apiLimiter } = require("./middleware/rateLimiters");
const authRoutes = require("./routes/authRoutes");
const guestRoutes = require("./routes/guestRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const honeymoonRoutes = require("./routes/honeymoonRoutes");
const timelineRoutes = require("./routes/timelineRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const tableRoutes = require("./routes/tableRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "WeddingOS API running",
  });
});

app.use("/auth", authLimiter, authRoutes);
app.use(authMiddleware);
app.use(apiLimiter);

app.use("/guests", guestRoutes);
app.use("/budget", budgetRoutes);
app.use("/honeymoon", honeymoonRoutes);
app.use("/timeline", timelineRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/tables", tableRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
