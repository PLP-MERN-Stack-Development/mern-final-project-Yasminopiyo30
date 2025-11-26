const express = require('express');
const router = express.Router();
const { 
  getParentProfile,
  updateParentProfile,
  getChildren,
  addChild,
  getParentSessions,
  getParentCompletedSessions
} = require('../controllers/parent');
const auth = require('../middleware/auth');

// Get parent profile
router.get('/profile', auth, getParentProfile);

// Update parent profile
router.put('/profile', auth, updateParentProfile);

// Get children
router.get('/children', auth, getChildren);

// Add a child
router.post('/children', auth, addChild);

// Get parent's sessions
router.get('/sessions', auth, getParentSessions);

// Get parent's completed sessions
router.get('/completed-sessions', auth, getParentCompletedSessions);

module.exports = router;