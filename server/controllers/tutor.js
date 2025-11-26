const Tutor = require('../models/Tutor');
const User = require('../models/User');
const Session = require('../models/Session');

// Get all tutors
const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find()
      .populate('userId', 'name email')
      .sort({ rating: -1 });
    
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tutor by ID
const getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tutor profile
const updateTutorProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }
    
    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tutor's upcoming sessions
const getTutorSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      tutorId: req.params.id,
      status: { $in: ['scheduled', 'in-progress'] }
    })
    .populate('parentId', 'name')
    .populate('studentId')
    .sort({ date: 1, startTime: 1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tutor's completed sessions
const getTutorCompletedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      tutorId: req.params.id,
      status: 'completed'
    })
    .populate('parentId', 'name')
    .populate('studentId')
    .sort({ date: -1, startTime: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTutors,
  getTutorById,
  updateTutorProfile,
  getTutorSessions,
  getTutorCompletedSessions
};