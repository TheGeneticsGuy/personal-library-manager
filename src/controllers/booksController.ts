import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Book, { IBook } from '../models/Book.js';

const getUserIdFromRequest = (_req: Request): Types.ObjectId | null => {
  return new Types.ObjectId('6831580fae7dfb1c639688a4'); // From the Seed import
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      res
        .status(401)
        .json({ message: 'User not authenticated or valid ID not provided.' });
      return;
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
      res.status(400).json({ message: 'Title and Author are required.' });
      return;
    }

    const newBookData: Partial<IBook> = {
      userId,
      title,
      author,
    };

    if (genre !== undefined) newBookData.genre = genre;
    if (status !== undefined) newBookData.status = status;
    if (pages !== undefined) newBookData.pages = Number(pages); // Realized numeric conversion necessary
    if (currentPage !== undefined)
      newBookData.currentPage = Number(currentPage);
    if (rating !== undefined) newBookData.rating = Number(rating);
    if (review !== undefined) newBookData.review = review;
    if (coverImageUrl !== undefined) newBookData.coverImageUrl = coverImageUrl;
    if (isbn !== undefined) newBookData.isbn = isbn;
    if (publishedYear !== undefined)
      newBookData.publishedYear = Number(publishedYear);

    const book = await Book.create(newBookData);

    // Response text - just report a few items
    res.status(201).json({
      id: book._id,
      title: book.title,
      author: book.author,
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      res.status(400).json({ message: 'Validation Error', errors: messages });
      return;
    }
    console.error('Error creating book:', error);
    next(error);
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      res
        .status(401)
        .json({ message: 'User not authenticated or valid ID not provided.' });
      return;
    }
    const books = await Book.find({ userId: userId });
    res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error('Error getting books:', error);
    next(error);
  }
};

export const getBookById = () => { };

export const updateBook = () => { };

export const deleteBook = () => { };
