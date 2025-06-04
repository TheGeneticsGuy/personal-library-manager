import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Book, { IBook } from '../models/Book.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import HttpError from '../utils/HttpError.js';

const getUserIdFromRequest = (_req: Request): Types.ObjectId | null => {
  return new Types.ObjectId('6831580fae7dfb1c639688a4'); // From the Seed import - placeholder for now
};

export const createBook = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    throw new HttpError(401, 'User is not found or not assigned.');
    // Can't add a book to no one. These are books being added to user profiles
    // and so a userId needs to be verified/authenticated first.
  }

  const {
    title,
    author,
    genre,
    status,
    pages,
    currentPage,
    rating,
    review,
    coverImageUrl,
    isbn,
    publishedYear,
  } = req.body;

  if (!title || !author) {
    throw new HttpError(400, 'Title and Author are required fields.');
  }

  const newBookData: Partial<IBook> = {
    userId,
    title,
    author,
  };

  if (genre !== undefined) newBookData.genre = genre;
  if (status !== undefined) newBookData.status = status;
  if (pages !== undefined) newBookData.pages = Number(pages); // Realized numeric conversion necessary
  if (currentPage !== undefined) newBookData.currentPage = Number(currentPage);
  if (rating !== undefined) newBookData.rating = Number(rating);
  if (review !== undefined) newBookData.review = review;
  if (coverImageUrl !== undefined) newBookData.coverImageUrl = coverImageUrl;
  if (isbn !== undefined) newBookData.isbn = isbn;
  if (publishedYear !== undefined)
    newBookData.publishedYear = Number(publishedYear);

  const book = await Book.create(newBookData);

  // Response text - just report a few items
  res.status(201).json({
    message: 'Book created successfully',
    data: {
      id: book._id,
      title: book.title,
      author: book.author,
    },
  });
});

// For the Get Route
export const getAllBooks = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const books = await Book.find({ userId: userId });

  res.status(200).json({
    message: 'Books retrieved successfully',
    count: books.length,
    data: books,
  });
});

// Get by ID Route
export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const bookId = req.params.id;

  if (!Types.ObjectId.isValid(bookId)) {
    throw new HttpError(400, 'Invalid book ID format.');
  }

  const book = await Book.findOne({ _id: bookId, userId: userId });

  if (!book) {
    throw new HttpError(
      404,
      'Book not found or you are not authorized to view it.'
    );
  }

  res.status(200).json({
    message: 'Book retrieved successfully',
    data: book,
  });
});

// PUT Route
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const bookId = req.params.id;

  if (!Types.ObjectId.isValid(bookId)) {
    throw new HttpError(400, 'Invalid book ID format.');
  }

  // In case an empt ytable is sent
  if (Object.keys(req.body).length === 0) {
    throw new HttpError(
      400,
      'There must be at least 1 value to update in the request'
    );
  }

  // See Book.ts for the exact schema - this is the req body
  const updateData: Partial<IBook> = {};
  const allowedFields: (keyof IBook)[] = [
    'title',
    'author',
    'genre',
    'status',
    'pages',
    'currentPage',
    'rating',
    'review',
    'coverImageUrl',
    'isbn',
    'publishedYear',
  ];

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      if (
        key === 'pages' ||
        key === 'currentPage' ||
        key === 'rating' ||
        key === 'publishedYear'
      ) {
        (updateData as any)[key] = Number(req.body[key]);
      } else {
        (updateData as any)[key] = req.body[key];
      }
    }
  }

  // DO NOT ALLOW UPDATING USERID EVEN IF TRIED - This is a fixed unique ID for DB
  if ((updateData as any).userId) {
    delete (updateData as any).userId;
  }

  // Quick logic change where if you set the book to FINISHED it resets book pages back to ZERO
  if (updateData.status === 'Finished') {
    updateData.currentPage = 0;
  }

  const updatedBook = await Book.findOneAndUpdate(
    { _id: bookId, userId: userId },
    { $set: updateData }, // $set makes it so only provided fields update
    { new: true, runValidators: true }
  );

  if (!updatedBook) {
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      throw new HttpError(404, 'Book not found.');
    } else {
      throw new HttpError(404, 'You are not authorized to update the book.');
    }
  }

  res.status(204).json({
    message: 'Book updated successfully',
    data: updatedBook,
  });
});

// DELETE route
export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  const bookId = req.params.id;

  if (!Types.ObjectId.isValid(bookId)) {
    throw new HttpError(400, 'Invalid book ID format.');
  }

  const deletedBook = await Book.findOneAndDelete({
    _id: bookId,
    userId: userId,
  });

  if (!deletedBook) {
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      throw new HttpError(404, 'Book not found.');
    } else {
      throw new HttpError(404, 'You are not authorized to delete the book.');
    }
  }

  res.status(200).json({
    message: 'Book deleted successfully',
  });
});
