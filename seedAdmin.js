const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await User.findOne({ email: 'admin@yahoo.com' });
    if (existing) {
      console.log('Admin user already exists.');
      return process.exit(0);
    }

    const admin = new User({
      username: 'adminbeaconfire',
      email: 'admin@yahoo.com',
      password: 'admin12345', // plain password (hashed by Mongoose pre-save hook)
      role: 'admin',
      isAdmin: true,
      favorites: []
    });

    await admin.save();
    console.log('Admin user created with password: admin12345');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
