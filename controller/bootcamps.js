const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')

// @desc			Get all bootcamps
// @route			GET  /api/v1/bootcamps
// @access		Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()

  res.status(200).json({
    status: 'success',
    count: bootcamps.length,
    data: bootcamps
  })
})

// @desc			Get single bootcamp
// @route			GET  /api/v1/bootcamps/:id
// @access		Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } =  req.params
  const bootcamp = await Bootcamp.findById(id)

  if (!bootcamp) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
  }

  res.status(200).json({
    status: 'success',
    data: bootcamp
  })
})

// @desc			Create new bootcamp
// @route			POST  /api/v1/bootcamps
// @access		Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({
    status: 'success',
    data: bootcamp
  })
})

// @desc			Update bootcamp
// @route			PUT  /api/v1/bootcamps/:id
// @access		Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } =  req.params
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })

  if (!bootcamp) {
    return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
  }

  res.status(200).json({
    status: 'success',
    data: bootcamp
  })

})

// @desc			Delete bootcamp
// @route			DELETE  /api/v1/bootcamps/:id
// @access		Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
		const { id } =  req.params
		const bootcamp = await Bootcamp.findByIdAndDelete(id)

		if (!bootcamp) {
			return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
		}

		res.status(200).json({
			status: 'success',
			data: {}
		})
	} catch (err) {
		next(err)
	}
}
