const errorHandler = (err, req, res, next) => {
  
  res.status(err.statusCode).json({
    status: 'fail',
    error: err.message || 'Server Error'
  })
}

module.exports = errorHandler
