const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

// @desc			Get all bootcamps
// @route			GET  /api/v1/bootcamps
// @access		Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $lt, $gte, $lte etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  // Finding resource
  let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
  if (req.query.select) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const bootcamps = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }


  res.status(200).json({
    status: 'success',
    count: bootcamps.length,
    pagination,
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
		const bootcamp = await Bootcamp.findById(id)

		if (!bootcamp) {
			return next(new ErrorResponse(`Resource not found with id of ${id}`, 404))
		}
    bootcamp.remove()
		res.status(200).json({
			status: 'success',
			data: {}
		})
	} catch (err) {
		next(err)
	}
}

// @desc			Get bootcamps within a radius
// @route			GET  /api/v1/bootcamps/radius/:zipcode/:distance
// @access		Private
exports.getBootcampsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const long = loc[0].longitude

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 miles OR 6378.1 km
  const radius = distance/3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [ [ long, lat ] , radius ] } }
  })

  res.status(200).json({
    status: 'success',
    count: bootcamps.length,
    data: bootcamps
  })
}
