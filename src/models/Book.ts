import { Schema, model, Document, Types } from 'mongoose';

export interface IBook extends Document {
  userId: Types.ObjectId; // Reference to the User who owns this book
  title: string;
  author: string;
  genre?: string; // Making genre optional as per some use cases
  status: 'To Read' | 'Reading' | 'Finished' | 'On Hold' | 'Dropped'; // Using string literals for status
  pages?: number; // Optional: total pages
  currentPage?: number; // Optional: current page for 'Reading' status
  rating?: number; // Optional: 1-5 stars
  review?: string; // Optional: user's review
  coverImageUrl?: string; // Optional
  isbn?: string; // Optional - Also different covers for same book
  publishedYear?: number; // Optional
  // Timestamps (addedAt/createdAt, updatedAt) are automatically managed by Mongoose
}

const bookSchema = new Schema<IBook>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // indexing so I can fetch a book by ID instead of a string
    },
    title: {
      type: String,
      required: [true, 'Book title is required.'], // Custom error message
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Book author is required.'],
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['To Read', 'Reading', 'Finished', 'On Hold', 'Dropped'],
        message: '{VALUE} is not a supported status.',
      },
      default: 'To Read',
    },
    pages: {
      type: Number,
      min: [0, 'Pages cannot be negative.'],
    },
    currentPage: {
      type: Number,
      min: [0, 'Current page cannot be negative.'],
      validate: [
        function (this: IBook, value: number): boolean {
          if (this.pages != null) {
            return value <= this.pages;
          }
          return true;
        },
        'Current page cannot exceed total pages.',
      ],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating cannot exceed 5.'],
    },
    review: {
      type: String,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
      // Basic ISBN-10 or ISBN-13 validation (can be more complex)
      // match: [/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, 'Invalid ISBN format.'], - MAYBE works - looked it up
    },
    publishedYear: {
      type: Number,
    },
  },
  {
    timestamps: true, // Automatically adds createdAtand updatedAt
  }
);

const Book = model<IBook>('Book', bookSchema);

export default Book;
