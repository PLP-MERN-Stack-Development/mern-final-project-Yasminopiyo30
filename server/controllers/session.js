const Session = require('../models/Session');
const Tutor = require('../models/Tutor');
const Parent = require('../models/Parent');

// Create a new session
const createSession = async (req, res) => {
  try {
    const { tutorId, studentId, subject, date, startTime, endTime, duration, amount } = req.body;

    // Verify that the tutor exists
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Create new session
    const session = new Session({
      tutorId,
      parentId: req.userId, // Parent ID comes from authenticated user
      studentId,
      subject,
      date: new Date(date),
      startTime,
      endTime,
      duration,
      amount
    });

    await session.save();

    // Populate the session before returning
    await session.populate('tutorId', 'userId bio subjects rating')
                  .populate('tutorId.userId', 'name email');

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('tutorId', 'userId bio subjects rating')
      .populate('tutorId.userId', 'name email')
      .populate('parentId', 'userId')
      .populate('parentId.userId', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update session
const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('tutorId', 'userId bio subjects rating')
    .populate('tutorId.userId', 'name email')
    .populate('parentId', 'userId')
    .populate('parentId.userId', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel session
const cancelSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session cancelled successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete session
const completeSession = async (req, res) => {
  try {
    const { feedback } = req.body;
    
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'completed',
        ...(feedback && { feedback })
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update tutor's rating if feedback was provided
    if (feedback && feedback.rating) {
      const tutor = await Tutor.findById(session.tutorId);
      if (tutor) {
        const totalRatings = tutor.totalRatings + 1;
        const newRating = ((tutor.rating * tutor.totalRatings) + feedback.rating) / totalRatings;
        
        await Tutor.findByIdAndUpdate(session.tutorId, {
          rating: newRating,
          totalRatings
        });
      }
    }

    res.json({ message: 'Session completed successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSession,
  getSessionById,
  updateSession,
  cancelSession,
  completeSession
};