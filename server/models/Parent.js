const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  children: [{
    name: String,
    age: Number,
    grade: String,
    subjects: [String]
  }],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: String,
  profilePicture: {
    type: String,
    default: ''
  },
  preferredTutors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Parent', parentSchema);