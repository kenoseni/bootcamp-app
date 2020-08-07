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
