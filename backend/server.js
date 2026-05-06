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

// Portfolio Routes
app.use('/api/portfolio', require('./src/modules/portfolio/portfolioRoutes'));

// Testimonial Routes
app.use('/api/testimonials', require('./src/modules/testimonial/testimonialRoutes'));

// Enquiry Routes
app.use('/api/enquiries', require('./src/modules/enquiry/enquiryRoutes'));

// Career Routes
app.use('/api/careers', require('./src/modules/career/careerRoutes'));

// Team Routes
app.use('/api/team', require('./src/modules/team/teamRoutes'));

// Employee Routes
app.use('/api/employees', require('./src/modules/employee/employeeRoutes'));

// Onboarding Routes
app.use('/api/onboarding', require('./src/modules/onboarding/onboardingRoutes'));
app.use('/api/public-onboarding', require('./src/modules/public-onboarding/publicOnboardingRoutes'));

// User Management Routes
app.use('/api/users', require('./src/modules/user-management/userManagementRoutes'));

// Dashboard Routes
app.use('/api/dashboard', require('./src/modules/dashboard/dashboardRoutes'));

// CRM Routes
app.use('/api/crm', require('./src/modules/crm/crmRoutes'));

// Performance Routes
app.use('/api/performance', require('./src/modules/performance/performanceRoutes'));

// HR Routes
app.use('/api/hr', require('./src/modules/hr/hrRoutes'));

// Leave Routes
app.use('/api/leave', require('./src/modules/hr/leaveRoutes'));

// Error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({ 
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
