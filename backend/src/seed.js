const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        
        if (existingAdmin) {
            existingAdmin.password = process.env.ADMIN_PASSWORD;
            await existingAdmin.save();
            console.log('Admin user credentials updated');
        } else {
            await User.create({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }
        
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
