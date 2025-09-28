const Session = require('../models/Session');

// @desc    Verify that the session belongs to the authenticated user
// @access  Private
const verifySessionOwnership = async (req, res, next) => {
  try {
    const sessionId = req.params.id || req.body.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if the session belongs to the authenticated user
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only modify your own sessions.' 
      });
    }

    // Attach the session to the request for use in controllers
    req.session = session;
    next();
  } catch (error) {
    console.error('Session ownership verification error:', error);
    res.status(500).json({ message: 'Server error verifying session ownership' });
  }
};

// @desc    Verify that the session exists and is accessible to the user
// @access  Private
const verifySessionAccess = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if the session belongs to the authenticated user
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only access your own sessions.' 
      });
    }

    // Attach the session to the request for use in controllers
    req.session = session;
    next();
  } catch (error) {
    console.error('Session access verification error:', error);
    res.status(500).json({ message: 'Server error verifying session access' });
  }
};

module.exports = {
  verifySessionOwnership,
  verifySessionAccess
};
