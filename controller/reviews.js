const Review = require('../models/Review')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')


// @desc		Get all reviews
// @route		GET  /api/v1/reviews
// @route		GET  /api/v1/bootcamps/:bootcampId/reviews
// @access		Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    const { bootcampId }  = req.params
    if (bootcampId) {
      const reviews = await Review.find( { bootcamp: bootcampId })
  
      return res.status(200).json({
        status: 'success',
        count: reviews.length,
        data: reviews
      })
    } else {
      res.status(200).json(res.advancedResults)
    }
  })
