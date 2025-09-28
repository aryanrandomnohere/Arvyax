const express = require('express');
const { 
  getAllPublishedSessions,
  getUserSessions,
  getUserSessionById,
  saveDraftSession,
  publishSession,
  updateSession,
  deleteSession,
  checkSessionEditPermission
} = require('../controllers/sessionController');
const authenticateUser = require('../middleware/authentication');
const { verifySessionOwnership, verifySessionAccess } = require('../middleware/sessionOwnership');
const { 
  validateSessionDraft, 
  validateSessionPublish, 
  validateSessionUpdate 
} = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/sessions
// @desc    Get all published sessions
// @access  Public
router.get('/', getAllPublishedSessions);

// @route   GET /api/sessions/my-sessions
// @desc    Get user's own sessions (drafts + published)
// @access  Private
router.get('/my-sessions', authenticateUser, getUserSessions);

// @route   GET /api/sessions/my-sessions/:id
// @desc    Get a single user session
// @access  Private
router.get('/my-sessions/:id', authenticateUser, verifySessionAccess, getUserSessionById);

// @route   POST /api/sessions/my-sessions/save-draft
// @desc    Save or update a draft session
// @access  Private
router.post('/my-sessions/save-draft', authenticateUser, validateSessionDraft, saveDraftSession);

// @route   POST /api/sessions/my-sessions/publish
// @desc    Publish a session
// @access  Private
router.post('/my-sessions/publish', authenticateUser, validateSessionPublish, publishSession);

// @route   PUT /api/sessions/my-sessions/:id
// @desc    Update a session
// @access  Private
router.put('/my-sessions/:id', authenticateUser, verifySessionOwnership, validateSessionUpdate, updateSession);

// @route   DELETE /api/sessions/my-sessions/:id
// @desc    Delete a session
// @access  Private
router.delete('/my-sessions/:id', authenticateUser, verifySessionOwnership, deleteSession);

// @route   GET /api/sessions/:id/can-edit
// @desc    Check if user can edit a session
// @access  Private
router.get('/:id/can-edit', authenticateUser, checkSessionEditPermission);

module.exports = router;
