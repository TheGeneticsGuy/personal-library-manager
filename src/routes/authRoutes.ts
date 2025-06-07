import express, { Request, Response, NextFunction } from 'express';
import passport from '../config/passport-setup.js';
import { IUser } from '../models/User.js';

const router = express.Router();

router.get(
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Initiate Google OAuth login'
  // #swagger.description = 'Redirects the user to Google for authentication.'
  // #swagger.responses[302] = { description: 'Redirect to Google OAuth server.' }
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
  // I had to setup the "scope" in the Google Cloud config to include profile/email
);

router.get(
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Google OAuth callback'
  // #swagger.description = 'Callback URL for Google to redirect to after authentication. Handles login/signup and session creation.'
  // #swagger.responses[200] = { description: 'Login successful.', schema: { type: 'object', properties: { message: { type: 'string' }, user: { $ref: "#/components/schemas/User" } } } }
  // #swagger.responses[401] = { description: 'Authentication failed.' }
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login-failed', // Where to redirect if auth fails - Future webpage
    failureMessage: true, // For the failure messages - req.session.messages
    session: true, // ESTABLISH SESSION - How did I miss this?
  }),
  (req: Request, res: Response) => {
    // Authenticated!!
    // res.redirect('http://localhost:3000/dashboard'); - Might add this for profile dash...

    // For now, let's send a JSON response.
    res.status(200).json({
      message: 'Login successful',
      user: req.user, // req.user is the authenticated user from your DB
    });
  }
);

// Route to check login status
router.get('/status', (req: Request, res: Response) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Check login status'
  // #swagger.description = 'Returns the current status of authenticated user, or an unauthorized status.'
  // #swagger.responses[200] = { description: 'User is authenticated.', schema: { type: 'object', properties: { authenticated: { type: 'boolean' }, user: { $ref: "#/components/schemas/User" } } } }
  // #swagger.responses[401] = { description: 'User is not authenticated.', schema: { type: 'object', properties: { authenticated: { type: 'boolean' }, message: { type: 'string' } } } }
  if (req.isAuthenticated && req.isAuthenticated()) {
    // req.isAuthenticated() is from Passport
    res.status(200).json({
      authenticated: true,
      user: req.user as IUser, // Cast to IUser for type safety
    });
  } else {
    res.status(401).json({
      authenticated: false,
      message: 'User is not authenticated.',
    });
  }
});

// Route for failed Google login
router.get('/login-failed', (req: Request, res: Response) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Login failed'
  // #swagger.description = 'Endpoint for when Google OAuth login fails.'
  // #swagger.responses[401] = { description: 'Google authentication failed.', schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, error: { type: 'string', 'nullable': true } } } }
  const messages = (req.session as any)?.messages || [];
  const failureMessage =
    messages.length > 0
      ? messages[messages.length - 1]
      : 'Google authentication failed.';
  if ((req.session as any)?.messages) delete (req.session as any).messages;

  res.status(401).json({
    success: false,
    message: 'Google authentication failed.',
    error: failureMessage, // This is the Passport error
  });
});

// Route for logout
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  // #swagger.tags = ['Authentication']
  // #swagger.summary = 'Logout user'
  // #swagger.description = 'Logs out the current user and ends/destroy the session.'
  // #swagger.responses[200] = { description: 'Successfully logged out.' }
  // #swagger.responses[500] = { description: 'Logout failed.' }
  req.logout((err) => {
    // req.logout() - Passport API
    if (err) {
      console.error('Error during req.logout:', err);
      return next(err); // Pass error to Express (global handler) makes most sense here I think.
    }
    // So after logout the session might exist, so apparently it is good practice to destroy session as well.
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Session termination error:', destroyErr);
        // Might as well give a message for at least a "partial" successful logout - you DID, but session not destroyed.
        return res.status(500).json({
          message: 'Logout successful, but session termination failed.',
        });
      }
      res.clearCookie('connect.sid'); // 'connect.sid' is default session cookie
      // res.redirect('/'); // Redirect to home - maybe?
      res.status(200).json({ message: 'Successfully logged out.' });
    });
  });
});
export default router;
