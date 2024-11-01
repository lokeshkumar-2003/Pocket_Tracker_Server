const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  transactions: [
    {
      amount: {
        type: Number,
        require: [true, "Enter the amount"],
      },
      description: {
        type: String,
        require: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      category: {
        type: String,
        require: [true, "Category is required"],
      },
      transactionType: {
        type: String,
        require: [true, "Expense or income are required"],
      },
    },
  ],
});

module.exports = mongoose.model("Transaction", TransactionSchema);
