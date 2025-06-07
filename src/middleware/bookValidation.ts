import { body, validationResult } from 'express-validator';
import Book from '../models/Book.js';
import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser } from '../models/User.js';

// Helper for user ID until I update the whole create User process
const getUserIdFromRequest = (_req: any): Types.ObjectId => {
  return new Types.ObjectId('6831580fae7dfb1c639688a4');
};

// Validation Rules for Creating a Book
export const createBookValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required.')
      .isString()
      .withMessage('Title must be a text string.')
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters.'),
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author is required.')
      .isString()
      .withMessage('Author must be a string.')
      .isLength({ min: 1, max: 255 })
      .withMessage('Author must be between 1 and 255 characters.'),
    body('genre')
      .optional()
      .trim()
      .isString()
      .withMessage('Genre must be a text string.')
      .isLength({ max: 50 })
      .withMessage('Genre cannot exceed 50 characters.'),
    body('status')
      .optional()
      .isIn(['To Read', 'Reading', 'Finished', 'On Hold', 'Dropped'])
      .withMessage(
        'Invalid status value. Must be one of: To Read, Reading, Finished, On Hold, Dropped.'
      ),
    body('pages')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Pages must be a non-negative integer.'),
    body('currentPage')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Current page must be a non-negative integer.')
      .custom(async (value, { req }) => {
        const bookId = (req as Request).params?.id;
        const pagesProvided = (req as Request).body.pages;
        let totalPages: number | undefined =
          pagesProvided !== undefined ? Number(pagesProvided) : undefined;

        // ensureAuthenticated middleware ran
        const user = (req as Request).user as IUser;
        if (!user || !user._id) {
          throw new Error(
            'User not authenticated. Cannot validate current page.'
          );
        }
        const userId = user._id;

        // If pages missing from request, let's get them
        if (
          pagesProvided === undefined &&
          bookId &&
          Types.ObjectId.isValid(bookId)
        ) {
          const existingBook = await Book.findOne({
            _id: new Types.ObjectId(bookId),
            userId: new Types.ObjectId(userId),
          })
            .select('pages')
            .lean();
          if (existingBook && existingBook.pages !== undefined) {
            totalPages = existingBook.pages;
          }
        }

        if (totalPages !== undefined && Number(value) > totalPages) {
          throw new Error('Current page cannot exceed total pages.');
        }
        return true;
      }),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5.'),
    body('review')
      .optional()
      .trim()
      .isString()
      .withMessage('Review must be a string.')
      .isLength({ max: 5000 })
      .withMessage('Review cannot exceed 5000 characters.'),
    body('coverImageUrl')
      .optional()
      .trim()
      .isURL()
      .withMessage('Book Image URL must be a valid URL.'),
    body('isbn').optional().trim().isISBN().withMessage('Invalid ISBN format.'), // Checks for ISBN-10 or ISBN-13
    body('publishedYear')
      .optional()
      .isInt({ min: 0, max: new Date().getFullYear() + 5 }) // Allow up to 5 years in future for pending releases
      .withMessage(
        `Published year must be a valid year (0 - ${new Date().getFullYear() + 5}).`
      ),
  ];
};

// --- Validation Rules for Updating a Book ---
// For updates, fields are often optional, but if provided, they must be valid.
// We also need to consider the currentPage vs pages logic based on potentially existing book data.
export const updateBookValidationRules = () => {
  return [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty if provided.')
      .isString()
      .withMessage('Title must be a text string.')
      .isLength({ min: 1, max: 255 })
      .withMessage('Title must be between 1 and 255 characters.'),
    body('author')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Author cannot be empty if provided.')
      .isString()
      .withMessage('Author must be a string.')
      .isLength({ min: 1, max: 255 })
      .withMessage('Author must be between 1 and 255 characters.'),
    body('genre')
      .optional()
      .trim()
      .isString()
      .withMessage('Genre must be a text string.')
      .isLength({ max: 50 })
      .withMessage('Genre cannot exceed 50 characters.'),
    body('status')
      .optional()
      .isIn(['To Read', 'Reading', 'Finished', 'On Hold', 'Dropped'])
      .withMessage(
        'Invalid status value. Must be one of: To Read, Finished, Read, On Hold, Dropped.'
      ),
    body('pages')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Pages must be a non-negative integer.'),
    body('currentPage')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Current page must be a non-negative integer.')
      .custom(async (value, { req }) => {
        const bookId = req.params?.id;
        const pagesProvided = req.body.pages;
        let totalPages: number | undefined = pagesProvided;

        // If pages is not in the update request, fetch the existing book's pages
        // basically, I am allowing flexibility to include total pages
        if (pagesProvided === undefined && bookId) {
          const userId = getUserIdFromRequest(req); // Get current user
          const existingBook = await Book.findOne({
            _id: bookId,
            userId: userId,
          })
            .select('pages')
            .lean();
          if (existingBook && existingBook.pages !== undefined) {
            totalPages = existingBook.pages;
          }
        }

        if (totalPages !== undefined && value > totalPages) {
          throw new Error('Current page cannot exceed total pages.');
        }
        return true;
      }),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5.'),
    body('review')
      .optional()
      .trim()
      .isString()
      .withMessage('Review must be a string.')
      .isLength({ max: 5000 })
      .withMessage('Review cannot exceed 5000 characters.'),
    body('coverImageUrl')
      .optional()
      .trim()
      .isURL()
      .withMessage('Cover image URL must be a valid URL.'),
    body('isbn').optional().trim().isISBN().withMessage('Invalid ISBN format.'),
    body('publishedYear')
      .optional()
      .isInt({ min: 0, max: new Date().getFullYear() + 5 })
      .withMessage(
        `Published year must be a valid year (0 - ${new Date().getFullYear() + 5}).`
      ),
  ];
};

// Validation Handler
// Middleware to check the result
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Next is how Express passes it on to the controller.
  }

  // Normalize the format of the errors for coinsistency
  const extractedErrors = errors.array().map((err) => {
    const param = (err as any).path || (err as any).param || 'unknown_field';
    return { [param]: err.msg };
  });

  res.status(422).json({
    // CODE 422 means I cannot process validation for some reason
    status: 'error',
    statusCode: 422,
    message: 'Validation failed. Please re-check inputs.',
    errors: extractedErrors,
  });
};
