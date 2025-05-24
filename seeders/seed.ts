import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Book from '../src/models/Book.js';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file for seeder.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('\n\n');
    console.log('MongoDB Connected for Seeding...');
  } catch (err: any) {
    console.error('MongoDB (seeder) connection error:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data - FOR TESTING ONLY!!!!!!!!
    console.log('Clearing existing User and Book data...');
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('Existing data cleared.');

    // 1. Create a Test User
    console.log('Creating test user...');
    const testUser = await User.create({
      oauthId: 'testuser001',
      oauthProvider: 'local-test',
      email: 'testuser@example.com',
      displayName: 'Test User',
      preferredGenres: ['Fantasy', 'Sci-Fi'],
      readingGoal: 25,
    });
    console.log(`Test user created with ID: ${testUser._id}`);
    console.log(`User ID: ${testUser.oauthId.toString()}`);
    console.log('----------------------------------------------------');

    // 2. Create Books for the Test User
    console.log('Creating seed books for the test user...');
    const booksToSeed = [
      {
        userId: testUser._id,
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        status: 'Read',
        pages: 310,
        rating: 5,
        review: 'A delightful adventure, perfect prelude to LOTR.',
        coverImageUrl: 'https://example.com/the_hobbit.jpg',
        isbn: '978-0547928227',
        publishedYear: 1937,
      },
      {
        userId: testUser._id,
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        status: 'Reading',
        pages: 412,
        currentPage: 150,
        coverImageUrl: 'https://example.com/dune.jpg',
        isbn: '978-0441172719',
        publishedYear: 1965,
      },
      {
        userId: testUser._id,
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        status: 'To Read',
        pages: 328,
        coverImageUrl: 'https://example.com/1984.jpg',
        isbn: '978-0451524935',
        publishedYear: 1949,
      },
      {
        userId: testUser._id,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Classic',
        status: 'Read',
        pages: 281,
        rating: 4,
        review: 'A powerful and moving story.',
        isbn: '978-0061120084',
        publishedYear: 1960,
      },
      {
        userId: testUser._id,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: 'Douglas Adams',
        genre: 'Science Fiction',
        status: 'On Hold',
        pages: 224,
        currentPage: 50,
        isbn: '978-0345391803',
        publishedYear: 1979,
      },
    ];

    await Book.insertMany(booksToSeed);
    console.log(`${booksToSeed.length} books seeded successfully!`);

    process.exit(0); // Exit script successfully
  } catch (error: any) {
    console.error('Error seeding data:', error.message);
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error(
        'Duplicate key error. Check your data or clear the collection if intended.'
      );
    }
    process.exit(1); // Exit with error
  }
};

seedData();
