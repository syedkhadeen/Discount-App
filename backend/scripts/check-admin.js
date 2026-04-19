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

async function checkAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'syed.khadeen@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Email Verified:', admin.isEmailVerified);
    console.log('Has Password Hash:', !!admin.passwordHash);
    console.log('Created At:', admin.createdAt);

    // Test password validation
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
    console.log('Password validation test:', isValid ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkAdmin();
