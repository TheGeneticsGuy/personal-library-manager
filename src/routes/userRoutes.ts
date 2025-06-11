import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from '../controllers/userController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';
import {
  updateUserValidationRules,
  validateRequest,
} from '../middleware/userValidation.js';

const router = express.Router();

// All routes require authentication
router.use(ensureAuthenticated);

// GET /users/profile

router.get(
  '/profile',
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get current user profile'
  // #swagger.description = 'Retrieves the full profile of the currently authenticated user.'
  // #swagger.responses[200] = { description: 'User profile retrieved.', schema: { $ref: "#/components/schemas/User" } }
  // #swagger.responses[401] = { description: 'Unauthorized.' }
  // #swagger.responses[404] = { description: 'User not found.' }
  getUserProfile
);

// PUT /users/profile
router.put(
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Update current user profile'
  // #swagger.description = 'Allows the authenticated user to update their profile information.'
  /* #swagger.requestBody = {
        required: true,
        content: {
        "application/json": {
            schema: {
            type: "object",
            properties: {
                displayName: { type: "string", example: "Jane Doe Updated" },
                firstName: { type: "string", example: "Jane" },
                lastName: { type: "string", example: "Doe" },
                profilePictureUrl: { type: "string", format: "url", example: "https://example.com/new_profile.jpg" },
                readingGoal: { type: "integer", example: 30, minimum: 0 }
            }
            }
        }
        }
    } */
  // #swagger.responses[200] = { description: 'User profile updated.', schema: { $ref: "#/components/schemas/User" } }
  // #swagger.responses[400] = { description: 'Invalid input.' }
  // #swagger.responses[401] = { description: 'Unauthorized.' }
  // #swagger.responses[404] = { description: 'User not found.' }
  '/profile',
  updateUserValidationRules(),
  validateRequest,
  updateUserProfile
);

// DELETE /users/profile
router.delete(
  '/profile',
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Delete current user account'
  // #swagger.description = 'Allows the authenticated user to delete their account and associated book data. This action is irreversible.'
  // #swagger.responses[200] = { description: 'User account deleted successfully.' }
  // #swagger.responses[401] = { description: 'Unauthorized.' }
  // #swagger.responses[404] = { description: 'User not found.' }
  deleteUserAccount
);

export default router;
