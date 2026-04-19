const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/discount_app';

// Schema with both fields so we can read/write whichever exists
const userSchema = new mongoose.Schema({
  userID: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  passwordHash: String,
  role: { type: String, enum: ['USER', 'ADMIN', 'RESTAURANT'], default: 'USER' },
  isEmailVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: Date,
});

const User = mongoose.model('User', userSchema);

async function fixUserSchema() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', MONGODB_URI);

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    let fixedCount = 0;

    for (const user of users) {
      let updated = false;

      // If only passwordHash exists, copy to password
      if (user.passwordHash && !user.password) {
        user.password = user.passwordHash;
        updated = true;
      }

      // If only password exists, copy to passwordHash
      if (user.password && !user.passwordHash) {
        user.passwordHash = user.password;
        updated = true;
      }

      if (updated) {
        await user.save();
        console.log(`Fixed ${user.email}`);
        fixedCount++;
      }
    }

    // Ensure admin exists
    const adminEmail = 'syed.khadeen@gmail.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('Admin does not exist. Creating...');
      const plain = 'admin123';
      const hashed = await bcrypt.hash(plain, 10);
      admin = new User({
        userID: 'admin001',
        name: 'Admin',
        email: adminEmail,
        password: hashed,
        passwordHash: hashed,
        role: 'ADMIN',
        isEmailVerified: true,
        createdAt: new Date(),
      });
      await admin.save();
      console.log('✅ Admin created:', adminEmail);
    } else {
      console.log('✅ Admin exists:', adminEmail);
    }

    console.log(`Done. Fixed users: ${fixedCount}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixUserSchema();