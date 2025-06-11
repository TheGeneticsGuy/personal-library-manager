import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport-setup.js';
import bookRoutes from './routes/booksRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Import my error handler
import {
  globalErrorHandler,
  notFoundHandler,
} from './middleware/errorHandler.js';

dotenv.config();
const app: Express = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trusting the Render Proxy - couldn't get deploy to work without this...
}

// Loading Swagger doc
let swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'swagger.json'), 'utf8')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ok, setup the OAuth Session
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    // Controls for session changes w/db
    resave: false, // No need to save if not modified
    saveUninitialized: false, // Don't create if nothing stored

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI!,
      collectionName: 'sessions_passport', // Google doc recommended to name the sessions collection
      ttl: 14 * 24 * 60 * 60, // Google recommended default was 14
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax', // mitigate CSRF (cross-site request forgery)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Enables persistent login with express-sessions

// ROUTES
// Welcome Route
app.get('/', (req: Request, res: Response) => {
  // #swagger.tags = ['General']
  // #swagger.summary = 'API Welcome Message'
  res.send('Welcome to the Personal Library Manager API for CSE 341!');
});

// Google OAuth
app.use('/auth', authRoutes);

// Usert Routes
app.use('/users', userRoutes);

// Books Route
app.use('/books', bookRoutes);

// 404 Handler - After all SPECIFIC routes
app.use(notFoundHandler);

// Global Error Handler - Always the very last middlewar
app.use(globalErrorHandler);

export default app;
