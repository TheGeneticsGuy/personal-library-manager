import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/HttpError.js';

export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next(); // User is authenticated - move on to next middleware route
  }

  next(new HttpError(401, 'User not authenticated. Please log in.'));
};
