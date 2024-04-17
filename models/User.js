const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  currentLevel: { type: Number, default: 0 }, // User's current level
  clarityPercentage: { type: Number, default: 0 }, // Clarity of Nabu's speech
  badgeGenerated: { type: Boolean, default: false } // Indicates if the badge has been generated
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

userSchema.methods.updateLevelAndClarity = async function() {
  try {
    if (this.currentLevel < 19) {
      this.currentLevel += 1;
      // Correctly calculate the clarity percentage as a 5% improvement per level
      this.clarityPercentage = Math.min(100, this.clarityPercentage + 5); // Ensure it does not exceed 100%
    } else if (this.currentLevel === 19) {
      this.currentLevel = 20; // Ensure the level is set to 20 and not incremented further
      this.clarityPercentage = 100; // Ensure clarity is set to 100%
      // Badge generation logic should be triggered elsewhere to ensure this method remains focused on level and clarity updates
    }
    // Prevent the level from exceeding 20
    if (this.currentLevel > 20) {
      console.log(`User ${this.username} level corrected to 20.`);
      this.currentLevel = 20; // Correct the level if it exceeds 20
    }
    await this.save();
  } catch (error) {
    console.error('Error updating level and clarity:', error.message, error.stack);
    throw error;
  }
};

userSchema.methods.markBadgeAsGenerated = async function() {
  try {
    this.badgeGenerated = true;
    await this.save();
  } catch (error) {
    console.error('Error marking badge as generated:', error.message, error.stack);
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;