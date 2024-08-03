const AppError = require("../utils/appError");

// Handle casting error when converting MongoDB ID
const handleCastErrorDB = (err) => {
  const message = `Invalid ID: ${err.value} `;
  return new AppError(message, 400);
};

// Handle duplicate field value error in MongoDB
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${field} with value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

// Handle validation error in MongoDB
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle JWT token error
const handleJWTError = () =>
  new AppError("Invalid token, please login again", 401);

// Handle expired JWT token error
const handleJWTExpiredError = () =>
  new AppError("Your token has expired, please login again", 401);

// Send detailed error response in development environment
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode || 500).json({
      status: err.status || "error",
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Rendered Website
    console.error("Error", err);
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
};

// Send concise error response in production environment
const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message,
      });
    } else {
      console.error("Error", err);
      return res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  } else {
    // Rendered website
    if (err.isOperational) {
      return res.status(err.statusCode).render("error", {
        title: "Something went wrong",
        msg: err.message,
      });
    } else {
      console.error("Error", err);
      return res.status(err.statusCode).render("error", {
        title: "Something went wrong",
        msg: "Please try again later!",
      });
    }
  }
};

// Main error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // Check error type and apply specific handling
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
