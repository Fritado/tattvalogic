const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const options = {
            family: 4,
            serverSelectionTimeoutMS: 5000,
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        
        if (process.env.NODE_ENV !== 'production') {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } else {
            console.log("MongoDB connected successfully");
        }
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
