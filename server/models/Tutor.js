const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  subjects: [{
    type: String
  }],
  hourlyRate: {
    type: Number
  },
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  profilePicture: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tutor', tutorSchema);