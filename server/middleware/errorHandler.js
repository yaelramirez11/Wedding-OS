const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ZodError") {
    return res.status(400).json({
      error: error.errors?.[0]?.message || "Invalid input",
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error:
      statusCode >= 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
  });
};

module.exports = errorHandler;
