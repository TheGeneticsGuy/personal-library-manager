import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/booksController.js';

// Placeholder for authentication middleware - not sure how to do this YET, but as per assignment... will be done in the next 4 weeks
// import { protect } from '../middleware/authMiddleware'; // I'll create this later

const router = express.Router();

// --- ALL BOOK ROUTES ---

router
  .route('/')
  .post(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Create a new book'
    // #swagger.description = 'Adds a new book to the user's collection.'
    createBook
  )
  .get(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Get all books for the user'
    // #swagger.description = 'Retrieves a list of all books for the current user.'
    getAllBooks
  );
router
  .route('/:id')
  .get(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Get a Specific Book by ID'
    // #swagger.description = 'Retrieve a book from the entire collection by the specific book ID'
    getBookById
  )
  .put(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Update a Book by ID'
    // #swagger.description = 'Update 1 or all properties of a specific book, by ID'
    updateBook
  )
  .delete(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Delete a Book by ID'
    // #swagger.description = 'Delete a specific book, by ID, from the entire book collection'
    deleteBook
  );

export default router;
