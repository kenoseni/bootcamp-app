const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')


// @desc			Get all courses
// @route			GET  /api/v1/courses
// @route			GET  /api/v1/bootcamps/:bootcampId/courses
// @access		Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId }  = req.params
  if (bootcampId) {
    const courses = await Course.find( { bootcamp: bootcampId })

    return res.status(200).json({
      status: 'success',
      count: courses.length,
      data: courses
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc			Get single course
// @route			GET  /api/v1/courses/:id
// @access		Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } =  req.params
  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if (!course) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
  }

  res.status(200).json({
    status: 'success',
    data: course
  })
})

// @desc			Create new course
// @route			POST  /api/v1/bootcamps/:bootcampId/courses
// @access		Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params
  req.body.bootcamp = bootcampId

  const bootcamp = await Bootcamp.findById(bootcampId)

  if (!bootcamp) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
  }

  const course = await Course.create(req.body)

  res.status(201).json({
    status: 'success',
    data: course
  })
})


// @desc			Update course
// @route			PUT  /api/v1/courses/:id
// @access		Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  let course = await Course.findById(id)

  if (!course) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
  }

  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: course
  })
})

// @desc			Delete course
// @route			DELETE  /api/v1/courses/:id
// @access		Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const course = await Course.findById(id)

  if (!course) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
  }

  await course.remove()

  res.status(200).json({
    status: 'success',
    data: {}
  })
})
