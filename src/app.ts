import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import bookRoutes from './routes/booksRoutes.js';
import {
  globalErrorHandler,
  notFoundHandler,
} from './middleware/errorHandler.js';

dotenv.config();
const app: Express = express();

// --- Loading Swagger doc ---
let swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'swagger.json'), 'utf8')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
// Welcome Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Personal Library Manager API for CSE 341!');
});

// Books Route
app.use('/books', bookRoutes);

// 404 Handler - After all SPECIFIC routes
app.use(notFoundHandler);

// Global Error Handler - Always the very last middlewar
app.use(globalErrorHandler);

export default app;
