// src/app.ts
console.log('--- src/app.ts --- TOP');
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import bookRoutes from './routes/booksRoutes.js';

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

// Basic error handling for now, this will be expanded upon for 404, etc..
// PLACEHOLDER - I WILL EXPAND THIS LATER!!!
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
