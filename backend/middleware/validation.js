const { body, validationResult } = require('express-validator');

// @desc    Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @desc    Validate user registration data
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// @desc    Validate user login data
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// @desc    Validate session draft data
const validateSessionDraft = [
  body('title')
    .notEmpty()
    .trim()
    .withMessage('Title is required'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('jsonFileUrl')
    .notEmpty()
    .trim()
    .withMessage('JSON file URL is required'),
  handleValidationErrors
];

// @desc    Validate session publish data
const validateSessionPublish = [
  body('sessionId')
    .notEmpty()
    .withMessage('Session ID is required'),
  handleValidationErrors
];

// @desc    Validate session update data
const validateSessionUpdate = [
  body('title')
    .optional()
    .notEmpty()
    .trim()
    .withMessage('Title cannot be empty'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('jsonFileUrl')
    .optional()
    .notEmpty()
    .trim()
    .withMessage('JSON file URL cannot be empty'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateSessionDraft,
  validateSessionPublish,
  validateSessionUpdate
};
