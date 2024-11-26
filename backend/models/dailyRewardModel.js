const mongoose = require("mongoose");

const dailyRewardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimedDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to check if a specific date has been claimed
dailyRewardSchema.methods.hasClaimedOnDate = function (date) {
  return this.claimedDates.some(
    (claim) => claim.date.toDateString() === date.toDateString()
  );
};

// Method to claim a reward for a specific date
dailyRewardSchema.methods.claimReward = function (date, amount) {
  // Remove any existing claim for this exact date
  this.claimedDates = this.claimedDates.filter(
    (claim) => claim.date.toDateString() !== date.toDateString()
  );

  // Add new claim
  this.claimedDates.push({ date, amount });
  return this.save();
};

module.exports = mongoose.model("DailyReward", dailyRewardSchema);
