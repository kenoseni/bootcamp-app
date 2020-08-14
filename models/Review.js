const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the review'],
    trim: true,
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 10']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }

})

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  
    const obj = await this.aggregate([
      // the objects here are called pipelines
      {
        $match: { bootcamp: bootcampId }
      },
      {
        $group: {
          _id: '$bootcamp',
          averageRating: { $avg: '$rating' }
        }
      }
  
    ])
    try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageRating: obj[0].averageRating
      })
    } catch (err) {
      console.log(err)
    }
  }
  
  // Call getAverageCost after save
  ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.bootcamp)
  })
  
  // Call getAverageCost before remove
  ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp)
  })

module.exports = mongoose.model('Review', ReviewSchema)