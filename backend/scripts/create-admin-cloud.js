const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to your cloud MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-username:your-password@mycluster.mfwctyr.mongodb.net/discount_app';

// User Schema
const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  role: { type: String, enum: ['USER', 'ADMIN', 'RESTAURANT'], default: 'USER' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Delete existing admin if exists
    await User.deleteOne({ email: 'syed.khadeen@gmail.com' });
    console.log('Removed existing admin user');

    // Create admin password hash
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const adminUser = new User({
      userId: 'admin001',
      name: 'Admin',
      email: 'syed.khadeen@gmail.com',
      phone: '',
      passwordHash: passwordHash,
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully in cloud database!');
    console.log('Email: syed.khadeen@gmail.com');
    console.log('Password: admin123');
    console.log('Role: ADMIN');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  }
}

createAdmin();
