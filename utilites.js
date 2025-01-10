const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4)
      ? "fail"
      : "internal database error";
    this.isOperational = true;
  }
}

const globalErrorHandler = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
  });
};

const formatString = (string) => {
  string = string.trim().replaceAll(" ", "");
  string = string[0].toUpperCase() + string.slice(1).toLowerCase();
  return string;
};

export { catchAsyncError, AppError, globalErrorHandler, formatString };
