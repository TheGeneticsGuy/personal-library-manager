import express from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/booksController.js';
import {
  createBookValidationRules,
  updateBookValidationRules,
  validateRequest,
} from '../middleware/bookValidation.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// PROTECTING ALL BOOK ROUTES!!!
router.use(ensureAuthenticated);

// ALL BOOK ROUTES

router
  .route('/')
  .post(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Create a new book'
    // #swagger.description = 'Adds a new book to the user\'s collection.'
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/BookUpdate"
                }
            }
        }
    } */
    // #swagger.responses[201] = { description: 'Book created successfully.' }
    // #swagger.responses[400] = { description: 'Invalid input.' }
    createBookValidationRules(),
    validateRequest,
    createBook
  )
  .get(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Get all books for the user'
    // #swagger.description = 'Retrieves a list of all books for the current user.'
    // #swagger.responses[200] = { description: 'A list of books in user\'s collection.')
    getAllBooks
  );

// Ok, let's move on to BY ID API
router
  .route('/:id')
  .get(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Get a Specific Book by ID'
    // #swagger.description = 'Retrieve a book from the entire collection by the specific book ID'
    // #swagger.responses[200] = { description: 'Added book\'s details.' }
    // #swagger.responses[400] = { description: 'Invalid ID format.' }
    // #swagger.responses[404] = { description: 'Book not found.' }
    // #swagger.responses[422] = { description: 'Unprocessable Entity' }
    getBookById
  )
  .put(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Update a Book by ID'
    // #swagger.description = 'Update 1 or all properties of a specific book, by ID'
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Book ID',
        required: true,
        schema: {
            type: 'string'
        }
    } */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/BookUpdate"
                }
            }
        }
    } */
    // #swagger.responses[204] = { description: 'Book updated successfully.' }
    // #swagger.responses[400] = { description: 'Invalid input or ID format.' }
    // #swagger.responses[404] = { description: 'Book not found.' }
    // #swagger.responses[422] = { description: 'Unprocessable Entity' }
    updateBookValidationRules(),
    validateRequest,
    updateBook
  )
  .delete(
    // #swagger.tags = ['Books']
    // #swagger.summary = 'Delete a Book by ID'
    // #swagger.description = 'Delete a specific book, by ID, from the entire book collection'
    /* #swagger.responses[200] = { description: 'Book deleted successfully.' } */
    /* #swagger.responses[400] = { description: 'Invalid ID format.' } */
    /* #swagger.responses[404] = { description: 'Book not found.' } */
    deleteBook
  );

export default router;
