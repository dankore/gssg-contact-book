const globalErrorHandler = (error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message || 'An error occurred';
  return res.status(status).json({
    success: false,
    message,
  });
};

module.exports = globalErrorHandler;
