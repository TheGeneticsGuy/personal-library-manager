import express from 'express';
import {
  createBook,
  getAllBooks,
  // getBookById, // To be added
  // updateBook,  // To be added
  // deleteBook   // To be added
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
// router.route('/:id')
//   .get(getBookById)    // GET /books/:id
//   .put(updateBook)     // PUT /books/:id
//   .delete(deleteBook); // DELETE /books/:id

export default router;
