import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const updateUserValidationRules = () => {
  return [
    body('displayName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Display name cannot be empty.')
      .isLength({ min: 2, max: 50 })
      .withMessage('Display name must be between 2 and 50 characters.'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters.'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters.'),
    body('profilePictureUrl')
      .optional({ checkFalsy: true }) // Doing this to allow an empty string to clear it
      .trim()
      .isURL()
      .withMessage('Profile picture must be a valid URL.'),
    body('readingGoal')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Reading goal cannot be negative.'),
  ];
};

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().map((err) => {
    const param = (err as any).path || (err as any).param || 'unknown_field';
    return { [param]: err.msg };
  });
  res.status(422).json({
    status: 'error',
    statusCode: 422,
    message: 'Validation failed.',
    errors: extractedErrors,
  });
};
