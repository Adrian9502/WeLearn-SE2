const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  dob: { type: Date, required: true },
  coins: { type: Number, default: 600 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastRewardClaim: {
    type: Date,
    default: null,
  },
});
// Prevent changing createdAt on updates
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Set updatedAt to the current date
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Check if entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to increase coins
userSchema.methods.addCoins = function (amount) {
  this.coins += amount;
  return this.save();
};

// Method to spend coins
userSchema.methods.spendCoins = function (amount) {
  if (this.coins >= amount) {
    this.coins -= amount;
    return this.save();
  } else {
    throw new Error("Insufficient coins");
  }
};

module.exports = mongoose.model("User", userSchema);
