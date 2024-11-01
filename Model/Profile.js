const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  monthlyIncome: {
    type: Number,
    default: 0,
    required: true,
  },
  highestTransaction: {
    type: Number,
    default: 0,
  },
  budgetGoal: {
    type: Number,
    default: 0,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  dob: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);
