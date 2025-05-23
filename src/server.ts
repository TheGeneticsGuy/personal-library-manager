import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 3001; // Default to 3001 if PORT not in .env

const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`); // Makes it easily  clickabe to open
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
};

startServer();
