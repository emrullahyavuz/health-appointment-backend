// Error handler middleware

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Sunucu hatası',
    status: err.status || 500
  });
}

module.exports = errorHandler; 