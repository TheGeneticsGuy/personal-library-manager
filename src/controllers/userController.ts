import { Request, Response } from 'express';
import User, { IUser } from '../models/User.js';
import Book from '../models/Book.js'; // To delete user's books if I delete the user...
import { asyncHandler } from '../middleware/errorHandler.js';
import HttpError from '../utils/HttpError.js';

// Gets the user profile of the currently authenticated user.
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    // NOTE req.user is filled by Passport
    const user = req.user as IUser;
    const userProfile = await User.findById(user._id).select('-__v'); // I had to add this to exclude the version key

    if (!userProfile) {
      throw new HttpError(404, 'User not found.');
    }

    res.status(200).json({
      message: 'User profile retrieved successfully.',
      data: userProfile,
    });
  }
);

// UPDATE User Profile
export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const userId = user._id;

    const { displayName, firstName, lastName, profilePictureUrl, readingGoal } =
      req.body;

    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      throw new HttpError(404, 'User not found.');
    }

    // Update fields if they are provided in the request body
    if (displayName !== undefined) userToUpdate.displayName = displayName;
    if (firstName !== undefined) userToUpdate.firstName = firstName;
    if (lastName !== undefined) userToUpdate.lastName = lastName;
    if (profilePictureUrl !== undefined)
      userToUpdate.profilePictureUrl = profilePictureUrl;
    if (readingGoal !== undefined) {
      const goal = Number(readingGoal);
      if (isNaN(goal) || goal < 0) {
        throw new HttpError(400, 'Reading goal cannot be below zero');
      }
      userToUpdate.readingGoal = goal;
    }

    const updatedUser = await userToUpdate.save();

    res.status(200).json({
      message: 'User profile updated successfully.',
      data: {
        _id: updatedUser._id,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profilePictureUrl: updatedUser.profilePictureUrl,
        readingGoal: updatedUser.readingGoal,
      },
    });
  }
);

// DELETE User Account
export const deleteUserAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const userIdToDelete = user._id; // ObjectId

    // Delete associated data, if the user is deleted, need to delete the books of that user.
    try {
      await Book.deleteMany({ userId: userIdToDelete });
      console.log(`Books for user ${userIdToDelete} deleted.`);
    } catch (bookError) {
      console.error(
        `Error deleting books for user ${userIdToDelete}:`,
        bookError
      );
    }

    const deletedUser = await User.findByIdAndDelete(userIdToDelete);

    if (!deletedUser) {
      throw new HttpError(404, 'User not found or already deleted.');
    }

    // Log the user and end the session
    req.logout((logoutErr) => {
      if (logoutErr) {
        console.error('Error during logout after user deletion:', logoutErr);
      }
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error(
            'Error destroying session after user deletion:',
            sessionErr
          );
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.status(200).json({
          message:
            'User account and all associated book data deleted successfully. You have been logged out.',
        });
      });
    });
  }
);
