const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        console.log(`Testing with email: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }
        
        console.log('User found, comparing password...');
        const isMatch = await user.comparePassword(password);
        console.log(`Password match: ${isMatch}`);
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

test();
