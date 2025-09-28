const Session = require('../models/Session');

// @desc    Get all published sessions
// @route   GET /api/sessions
// @access  Public
const getAllPublishedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .select('-jsonFileUrl'); // Don't expose full URLs in public listing

    res.json({
      message: 'Published sessions retrieved successfully',
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error retrieving sessions' });
  }
};

// @desc    Get user's own sessions (drafts + published)
// @route   GET /api/sessions/my-sessions
// @access  Private
const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({
      message: 'User sessions retrieved successfully',
      sessions
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({ message: 'Server error retrieving user sessions' });
  }
};

// @desc    Get a single user session
// @route   GET /api/sessions/my-sessions/:id
// @access  Private
const getUserSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      message: 'Session retrieved successfully',
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error retrieving session' });
  }
};

// @desc    Save or update a draft session
// @route   POST /api/sessions/my-sessions/save-draft
// @access  Private
const saveDraftSession = async (req, res) => {
  try {
    const { title, tags = [], jsonFileUrl, sessionId } = req.body;

    let session;
    
    if (sessionId) {
      // Update existing session
      session = await Session.findOneAndUpdate(
        { _id: sessionId, userId: req.user._id },
        { 
          title, 
          tags, 
          jsonFileUrl, 
          updatedAt: new Date() 
        },
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({ message: 'Draft session not found' });
      }
    } else {
      // Create new draft session
      session = new Session({
        userId: req.user._id,
        title,
        tags,
        jsonFileUrl,
        status: 'draft'
      });
      await session.save();
    }

    res.json({
      message: 'Draft saved successfully',
      session
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ message: 'Server error saving draft' });
  }
};

// @desc    Publish a session
// @route   POST /api/sessions/my-sessions/publish
// @access  Private
const publishSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId: req.user._id },
      { 
        status: 'published',
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      message: 'Session published successfully',
      session
    });
  } catch (error) {
    console.error('Publish session error:', error);
    res.status(500).json({ message: 'Server error publishing session' });
  }
};

// @desc    Update a session
// @route   PUT /api/sessions/my-sessions/:id
// @access  Private
const updateSession = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      message: 'Session updated successfully',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Server error updating session' });
  }
};

// @desc    Delete a session
// @route   DELETE /api/sessions/my-sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error deleting session' });
  }
};

// @desc    Check if user can edit a session
// @route   GET /api/sessions/:id/can-edit
// @access  Private
const checkSessionEditPermission = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ 
        message: 'Session not found',
        canEdit: false 
      });
    }

    // Check if the session belongs to the authenticated user
    const canEdit = session.userId.toString() === req.user._id.toString();

    res.json({
      message: canEdit ? 'You can edit this session' : 'Access denied',
      canEdit,
      session: canEdit ? {
        id: session._id,
        title: session.title,
        status: session.status,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      } : null
    });
  } catch (error) {
    console.error('Check edit permission error:', error);
    res.status(500).json({ 
      message: 'Server error checking edit permission',
      canEdit: false 
    });
  }
};

module.exports = {
  getAllPublishedSessions,
  getUserSessions,
  getUserSessionById,
  saveDraftSession,
  publishSession,
  updateSession,
  deleteSession,
  checkSessionEditPermission
};
