const express = require('express');
const router = express.Router();
const { 
  getAllTutors, 
  getTutorById, 
  updateTutorProfile,
  getTutorSessions,
  getTutorCompletedSessions
} = require('../controllers/tutor');
const auth = require('../middleware/auth');

// Get all tutors
router.get('/', getAllTutors);

// Get tutor by ID
router.get('/:id', getTutorById);

// Update tutor profile (tutor only)
router.put('/profile', auth, updateTutorProfile);

// Get tutor's sessions
router.get('/:id/sessions', auth, getTutorSessions);

// Get tutor's completed sessions
router.get('/:id/completed-sessions', auth, getTutorCompletedSessions);

module.exports = router;