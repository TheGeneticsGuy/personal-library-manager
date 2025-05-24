const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const outputFile = './swagger.json';
const endpointsFiles = [
    './src/app.ts'
];

const doc = {
    info: {
        title: 'Personal Library Manager API',
        description: 'API documentation for the Personal Library Manager application.',
        version: '1.0.0',
    },

    servers: [
        {
            url: 'http://localhost:3000/', // I will update this for RENDER URL once I have
            description: 'Development server'
        },
    ],
    tags: [
        { name: 'Books', description: 'Books management' },
        { name: 'Users', description: 'User Profile Management (OAuth Managed)' }
    ],
    components: {
        schemas: {
            Book: {
                type: 'object',
                properties: {
                    _id: { type: 'string', readOnly: true, example: '60c72b9f9b1d8c001f8e4a9a' },
                    userId: { type: 'string', readOnly: true, example: '60c72b9f9b1d8c001f8e4b9b' },
                    title: { type: 'string', example: 'The Great Gatsby' },
                    author: { type: 'string', example: 'F. Scott Fitzgerald' },
                    genre: { type: 'string', example: 'Classic' },
                    status: { type: 'string', enum: ['To Read', 'Reading', 'Read', 'On Hold', 'Dropped'], example: 'To Read' },
                    pages: { type: 'integer', example: 180 },
                    currentPage: { type: 'integer', example: 50 },
                    rating: { type: 'integer', min: 1, max: 5, example: 4 },
                    review: { type: 'string', example: 'A timeless classic...' },
                    coverImageUrl: { type: 'string', format: 'url', example: 'https://example.com/cover.jpg' },
                    isbn: { type: 'string', example: '978-0743273565' },
                    publishedYear: { type: 'integer', example: 1925 },
                    createdAt: { type: 'string', format: 'date-time', readOnly: true },
                    updatedAt: { type: 'string', format: 'date-time', readOnly: true },
                }
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', readOnly: true, example: '60c72b9f9b1d8c001f8e4b9b' },
                    oauthId: { type: 'string', readOnly: true },
                    oauthProvider: { type: 'string', readOnly: true },
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    displayName: { type: 'string', example: 'John Doe' },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    profilePictureUrl: { type: 'string', format: 'url', example: 'https://example.com/profile.jpg' },
                    preferredGenres: { type: 'array', items: { type: 'string' }, example: ['Sci-Fi', 'Fantasy'] },
                    readingGoal: { type: 'integer', example: 50, minimum: 0 },
                    createdAt: { type: 'string', format: 'date-time', readOnly: true },
                    updatedAt: { type: 'string', format: 'date-time', readOnly: true },
                }
            },
            BookInputRequired: { // For POST request body
                type: 'object',
                required: ['title', 'author'],
                properties: {
                    title: { type: 'string', example: 'The Lord of the Rings' },
                    author: { type: 'string', example: 'J.R.R. Tolkien' },
                    genre: { type: 'string', example: 'Fantasy' },
                    status: { type: 'string', enum: ['To Read', 'Reading', 'Read', 'On Hold', 'Dropped'], default: 'To Read' },
                    pages: { type: 'integer', example: 1178, minimum: 0 },
                    currentPage: { type: 'integer', example: 0, minimum: 0 },
                    rating: { type: 'integer', example: 5, minimum: 1, maximum: 5 },
                    review: { type: 'string', example: 'An epic masterpiece.' },
                    coverImageUrl: { type: 'string', format: 'url', example: 'https://example.com/lotr.jpg' },
                    isbn: { type: 'string', example: '978-0618640157' },
                    publishedYear: { type: 'integer', example: 1954 },
                }
            },
            BookUpdateInput: { // For PUT request body (all fields optional)
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'The Hobbit' },
                    author: { type: 'string', example: 'J.R.R. Tolkien' },
                    genre: { type: 'string', example: 'Fantasy' },
                    status: { type: 'string', enum: ['To Read', 'Reading', 'Read', 'On Hold', 'Dropped'] },
                    pages: { type: 'integer', example: 310, minimum: 0 },
                    currentPage: { type: 'integer', example: 150, minimum: 0 },
                    rating: { type: 'integer', example: 4, minimum: 1, maximum: 5 },
                    review: { type: 'string', example: 'A delightful adventure.' },
                    coverImageUrl: { type: 'string', format: 'url', example: 'https://example.com/hobbit.jpg' },
                    isbn: { type: 'string', example: '978-0547928227' },
                    publishedYear: { type: 'integer', example: 1937 },
                }
            }
        },
        // securitySchemes: {
        // //   -- PENDING
        // }
    },
};

swaggerAutogen(outputFile, endpointsFiles, doc);