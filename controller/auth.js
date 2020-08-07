const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')

// @desc			Register new user
// @route			POST  /api/v1/auth/register
// @access		    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  })

  // Create token
  const token = await user.getSignedJwtToken()
  
  res.status(201).json({
    status: 'success',
    data: {...user._doc, token}
  })
})

// @desc			Login user
// @route			POST  /api/v1/auth/login
// @access		    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email or password', 400))
  }

  // Check for user user
  const user = await User.findOne({email}).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  
  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }

  // Create token
  const token = await user.getSignedJwtToken()
  
  res.status(200).json({
    status: 'success',
    data: {id: user._id, token}
  })
})
