const express = require('express');
const router = express.Router();
const { 
  createSession,
  getSessionById,
  updateSession,
  cancelSession,
  completeSession
} = require('../controllers/session');
const auth = require('../middleware/auth');

// Create a new session
router.post('/', auth, createSession);

// Get session by ID
router.get('/:id', auth, getSessionById);

// Update session
router.put('/:id', auth, updateSession);

// Cancel session
router.put('/:id/cancel', auth, cancelSession);

// Complete session
router.put('/:id/complete', auth, completeSession);

module.exports = router;