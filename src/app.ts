import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple welcome route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Personal Library Manager API!');
});

// Basic error handling for now, this will be expanded upon for 404, etc..
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
