const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static folders
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to TattvaLogic CMS API' });
});

// Auth Routes
app.use('/api/auth', require('./src/modules/auth/authRoutes'));

// Blog Routes
app.use('/api/blogs', require('./src/modules/blog/blogRoutes'));

// Enquiry Routes
app.use('/api/enquiries', require('./src/modules/enquiry/enquiryRoutes'));

// Career Routes
app.use('/api/careers', require('./src/modules/career/careerRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
