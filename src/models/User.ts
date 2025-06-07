import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  oauthId: string; // ID from the OAuth provider (like Google or Github or Facebook, and  so on)
  oauthProvider: string; // Just the name, like GOogle
  email: string; // From OAuth (this also should be unique)
  displayName: string; // From OAuth - thinking this should be login name?
  firstName?: string; // Maybe option, from OAuth or user input
  lastName?: string; // Same, from OAuth or user input
  profilePictureUrl?: string; // Optional, from OAuth
  readingGoal?: number; // Books to read per year
}

// Note - this is a database schema, not the GraphQL Schema as I am building this as a REST API.
const userSchema = new Schema<IUser>(
  {
    oauthId: {
      type: String,
      required: true,
    },
    oauthProvider: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Store emails in lowercase in case of input
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
    },
    readingGoal: {
      type: Number,
      min: 0, // Reading goal cannot be negative
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ oauthProvider: 1, oauthId: 1 }, { unique: true });

const User = model<IUser>('User', userSchema);

export default User;
