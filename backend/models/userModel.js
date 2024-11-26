const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    dob: { type: Date, required: true },
    coins: { type: Number, default: 600 },
    profilePicture: {
      type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and string
      default: "/uploads/default-profile.png",
      // Optional: add a custom validator
      validate: {
        validator: function (v) {
          // If it's an ObjectId or a string path, it's valid
          return (
            mongoose.Types.ObjectId.isValid(v) ||
            (typeof v === "string" && v.startsWith("/uploads/"))
          );
        },
        message: (props) => `${props.value} is not a valid profile picture!`,
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastRewardClaim: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
// If profilePicture is a string path and needs to be an ObjectId,
// you might want to add a pre-save hook to handle conversion
userSchema.pre("save", function (next) {
  // If profilePicture is a string path, you might want to handle it
  // This could involve uploading the file and getting its ObjectId
  // or keeping it as a string if that's acceptable
  if (typeof this.profilePicture === "string") {
    // Option 1: Keep as string if it's a valid path
    if (this.profilePicture.startsWith("/uploads/")) {
      return next();
    }

    // Option 2: Set to default if not a valid path
    // this.profilePicture = "/uploads/default-profile.png";
  }

  next();
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
