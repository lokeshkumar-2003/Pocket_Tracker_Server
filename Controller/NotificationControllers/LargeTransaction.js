const Profile = require("../../Model/Profile.js");
const Transaction = require("../../Model/Transaction.js");
const LargeTransaction = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User id is required",
    });
  }

  const userTransactions = await Transaction.findOne({ userId });
  const userDetails = await Profile.findOne({ userId });

  const userMonthlySalary = userDetails.monthlySalary;

  // Check if there are any transactions
  const transactionRecords = userTransactions
    ? userTransactions.transactions
    : [];

  if (transactionRecords.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No transactions found",
    });
  }

  const recentTransaction = transactionRecords[transactionRecords.length - 1];

  const halfOfTheIncome = userMonthlySalary / 2;

  // Compare recent transaction amount
  if (
    recentTransaction.amount >= halfOfTheIncome ||
    recentTransaction.amount >= userDetails.highestTransaction
  ) {
    // Update highest transaction if necessary
    userDetails.highestTransaction = recentTransaction.amount;
    await userDetails.save();

    return res.status(200).json({
      success: true,
      message: "You have a high transaction",
    });
  }

  return res.status(200).json({
    success: false,
    message: "No large transaction detected",
  });
};

module.exports = LargeTransaction;
