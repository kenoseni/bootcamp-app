const jwt = require('jsonwebtoken')
const asyncHandelr = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')


// Protect routes
exports.protect = asyncHandelr(async(req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // else if(req.cookies.token) {
  //   token = req.cookies.token
  // }

  if(!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded._id)
    
    next()

  } catch(e) {
    return next(new ErrorResponse('Not authorized to access this route', 401))
  }
})
