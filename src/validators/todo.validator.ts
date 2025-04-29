import { body } from 'express-validator';

export const validateTodoCreate = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('dueDate must be a valid ISO8601 date string'),

  body('priority')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Priority must be an integer between 1 and 5'),
];

export const validateTodoUpdate = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('dueDate must be a valid ISO8601 date string'),

  body('priority')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Priority must be an integer between 1 and 5'),
];
