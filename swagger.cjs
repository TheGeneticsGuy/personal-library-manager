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
            url: 'https://personal-library-manager-cavh.onrender.com/', //
            description: 'Development server'
        },
    ],
    tags: [
        { name: 'Books', description: 'Books management' },
        { name: 'Users', description: 'Authentication (Passport Google OAuth2)' }
    ],
    components: {
        schemas: {
            Book: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'The Great Gatsby' },
                    author: { type: 'string', example: 'F. Scott Fitzgerald' },
                    genre: { type: 'string', example: 'Classic' },
                    status: { type: 'string', enum: ['To Read', 'Reading', 'Finished', 'On Hold', 'Dropped'], example: 'To Read' },
                    pages: { type: 'integer', example: 180 },
                    currentPage: { type: 'integer', example: 50 },
                    rating: { type: 'integer', min: 1, max: 5, example: 4 },
                    review: { type: 'string', example: 'A timeless classic...' },
                    coverImageUrl: { type: 'string', format: 'url', example: 'https://example.com/cover.jpg' },
                    isbn: { type: 'string', example: '978-0743273565' },
                    publishedYear: { type: 'integer', example: 1925 },
                },
                required: [
                "title",
                "author"
                ],
            },
            BookInput: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'Book Date' },
                    author: { type: 'string', example: 'F. Scott Fitzgerald' },
                    genre: { type: 'string', example: 'Classic' },
                    status: { type: 'string', enum: ['To Read', 'Reading', 'Finished', 'On Hold', 'Dropped'], example: 'To Read' },
                    pages: { type: 'integer', example: 180 },
                    currentPage: { type: 'integer', example: 50 },
                    rating: { type: 'integer', min: 1, max: 5, example: 4 },
                    review: { type: 'string', example: 'A timeless classic...' },
                    coverImageUrl: { type: 'string', format: 'url', example: 'https://example.com/cover.jpg' },
                    isbn: { type: 'string', example: '978-0743273565' },
                    publishedYear: { type: 'integer', example: 1925 },
                },
                required: [
                "title",
                "author"
                ],
            },
            BookUpdate: {
                title: "Book Title",
                author: "Full Name of Author",
                genre: "Genre Category",
                status: "To Read, Reading, Finished, On Hold, Dropped",
                pages: 150,
                currentPage: 0,
                rating: 5,
                review: "A timeless classic...",
                coverImageUrl: "https://example.com/imageName.jpg",
                isbn: "978-0609807255",
                publishedYear: 2025
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
                    readingGoal: { type: 'integer', example: 50, minimum: 0 },
                }
            }
        },
        // securitySchemes: {
        // //   -- PENDING
        // }
    },
};

swaggerAutogen(outputFile, endpointsFiles, doc);