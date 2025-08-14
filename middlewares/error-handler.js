const errorHandler = (err, req, res, next) => {
  console.error(err);
  // Use the error's statusCode if it exists, otherwise default to 500
  res.status(err.statusCode || 500).send({
    message: err.message || "An error occurred on the server",
  });
};

module.exports = errorHandler;
