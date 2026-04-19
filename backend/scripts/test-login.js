const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/food-discount-app';

// User Schema (matching the backend schema)
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

async function testLogin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'syed.khadeen@gmail.com';
    const password = 'admin123';

    // Step 1: Find user
    const user = await User.findOne({ email });
    console.log('Step 1 - Find user:', user ? 'Found' : 'Not found');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('User details:', {
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      hasPasswordHash: !!user.passwordHash
    });

    // Step 2: Check email verification
    if (!user.isEmailVerified) {
      console.log('❌ Email not verified');
      return;
    }
    console.log('Step 2 - Email verification: ✅ PASS');

    // Step 3: Validate password
    if (!user.passwordHash) {
      console.log('❌ No password hash');
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log('Step 3 - Password validation:', valid ? '✅ PASS' : '❌ FAIL');

    if (valid) {
      console.log('🎉 Login should work!');
    } else {
      console.log('❌ Password validation failed');
    }

  } catch (error) {
    console.error('Error testing login:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testLogin();
