import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/HttpError.js';

// Async Handler Utility - Any error caught during async function gets caught and passed
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 Not Found - Triggered ONLY if no other route matches
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new HttpError(404, `Not Found - ${req.originalUrl}`);
  next(error); // next means to pass it to the global handler (Express feature)
};

// Express Global Error Handler
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // Adding this as I kept getting false positive when I npm run lint
  _next: NextFunction
) => {
  console.error(`Error at: "${req.originalUrl}"`);
  console.error(err.stack);

  let statusCode = 500;
  let message = 'An unexpected error occurred. Please try again.';
  let errors: any | undefined = undefined;

  if (err instanceof HttpError) {
    statusCode = err.status;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    // MongooseDB validation error
    statusCode = 400;
    message = 'Validation Error';

    const mongooseError = err as any; // Using any to get all of mongoose properties
    if (mongooseError.errors) {
      errors = Object.values(mongooseError.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
      }));
    } else {
      message = err.message || 'Validation failed';
    }
  } else if (err.name === 'CastError' && (err as any).kind === 'ObjectId') {
    // Mongoose CastError
    statusCode = 400;
    message = `Invalid ID format provided.`;
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
