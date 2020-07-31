const Course = require('../models/Course')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')


// @desc			Get all courses
// @route			GET  /api/v1/courses
// @route			GET  /api/v1/bootcamps/:bootcampId/courses
// @access		Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query
  const { bootcampId }  = req.params
  if (bootcampId) {
    query = Course.find( { bootcamp: bootcampId })
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    })
  }

  const courses = await query

  res.status(200).json({
    status: 'success',
    count: courses.length,
    data: courses
  })
})
