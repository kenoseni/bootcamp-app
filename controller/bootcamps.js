const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')

// @desc			Get all bootcamps
// @route			GET  /api/v1/bootcamps
// @access		Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find()

		res.status(200).json({
			status: 'success',
			count: bootcamps.length,
			data: bootcamps
		})
	}catch (err) {
		res.status(400).json({status: 'fail'})
	}
}

// @desc			Get single bootcamp
// @route			GET  /api/v1/bootcamps/:id
// @access		Public
exports.getBootcamp = async (req, res, next) => {
	const { id } =  req.params

  try {
		const bootcamp = await Bootcamp.findById(id)

		if (!bootcamp) {
			return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))
		}

		res.status(200).json({
			status: 'success',
			data: bootcamp
		})
	}catch (err) {
		next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404))
	}
}

// @desc			Create new bootcamp
// @route			POST  /api/v1/bootcamps
// @access		Private
exports.createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body)
		res.status(201).json({
			status: 'success',
			data: bootcamp
		})
	}catch (err) {
		res.status(400).json({status: 'fail'})
	}
}

// @desc			Update bootcamp
// @route			PUT  /api/v1/bootcamps/:id
// @access		Private
exports.updateBootcamp = async (req, res, next) => {
  const { id } =  req.params
  try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true
		})

		if (!bootcamp) {
			return res.status(404).json({status: 'fail'})
		}

		res.status(200).json({
			status: 'success',
			data: bootcamp
		})
	}catch (err) {
		res.status(400).json({status: 'fail'})
	}
}

// @desc			Delete bootcamp
// @route			DELETE  /api/v1/bootcamps/:id
// @access		Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
		const { id } =  req.params
		const bootcamp = await Bootcamp.findByIdAndDelete(id)

		if (!bootcamp) {
			return res.status(404).json({status: 'fail'})
		}

		res.status(200).json({
			status: 'success',
			data: {}
		})
	}catch (err) {
		res.status(400).json({status: 'fail'})
	}
}


