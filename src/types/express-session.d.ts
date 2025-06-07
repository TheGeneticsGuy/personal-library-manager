import 'express-session';
import { IUser } from '../models/User';

declare module 'express-session' {
  interface SessionData {
    messages?: string[];
    // Passport adds its own properties for failure messages
  }
}

declare global {
  namespace Express {
    interface User extends IUser {} // Using my IUser with Express's Request Interface by way of inheritance

    interface Request {
      user?: User; // Passport attaches user here
      login(user: User, done: (err: any) => void): void;
      login(user: User, options: any, done: (err: any) => void): void;
      logIn(user: User, done: (err: any) => void): void;
      logIn(user: User, options: any, done: (err: any) => void): void;
      logout(done: (err: any) => void): void;
      logOut(done: (err: any) => void): void;
      isAuthenticated(): boolean;
      isUnauthenticated(): boolean;
    }
  }
}
