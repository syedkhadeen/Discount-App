const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/discount_app';

// User Schema (simplified version for the script)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['USER', 'ADMIN', 'RESTAURANT'], default: 'USER' },
  isEmailVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing admin if exists
    await User.deleteOne({ email: 'syed.khadeen@gmail.com' });
    console.log('Removed existing admin user');

    // Create admin password hash
    const password = 'admin123'; // You can change this password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'syed.khadeen@gmail.com',
      passwordHash: passwordHash,
      role: 'ADMIN',
      isEmailVerified: true,
      createdAt: new Date()
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: syed.khadeen@gmail.com');
    console.log('Password: admin123');
    console.log('Role: ADMIN');
    console.log('Email Verified: true');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
