const Parent = require('../models/Parent');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Session = require('../models/Session');

// Get parent profile
const getParentProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId })
      .populate('userId', 'name email')
      .populate('preferredTutors', 'userId bio subjects rating hourlyRate');
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }
    
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update parent profile
const updateParentProfile = async (req, res) => {
  try {
    const parent = await Parent.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }
    
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get parent's children
const getChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.userId });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }
    
    res.json(parent.children);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a child
const addChild = async (req, res) => {
  try {
    const { name, age, grade, subjects } = req.body;
    
    const parent = await Parent.findOne({ userId: req.userId });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }
    
    parent.children.push({ name, age, grade, subjects });
    await parent.save();
    
    res.status(201).json(parent.children[parent.children.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get parent's upcoming sessions
const getParentSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      parentId: req.userId,
      status: { $in: ['scheduled', 'in-progress'] }
    })
    .populate('tutorId', 'userId bio subjects rating')
    .populate('tutorId.userId', 'name email')
    .sort({ date: 1, startTime: 1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get parent's completed sessions
const getParentCompletedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      parentId: req.userId,
      status: 'completed'
    })
    .populate('tutorId', 'userId bio subjects rating')
    .populate('tutorId.userId', 'name email')
    .sort({ date: -1, startTime: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getParentProfile,
  updateParentProfile,
  getChildren,
  addChild,
  getParentSessions,
  getParentCompletedSessions
};