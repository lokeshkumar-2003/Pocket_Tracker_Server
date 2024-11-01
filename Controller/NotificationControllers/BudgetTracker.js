const Profile = require("../../Model/Profile.js");
const Transaction = require("../../Model/Transaction.js");

const BudgetTracker = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const userProfile = await Profile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    const budget = userProfile.budgetGoal;

    const transactionList = await Transaction.findOne({ userId });
    if (!transactionList || !transactionList.transactions) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for the user",
      });
    }

    const transactionRecords = transactionList.transactions;

    let totalExpense = 0;
    transactionRecords.forEach((trans) => {
      if (trans.transactionType === "Expense") {
        totalExpense += trans.amount;
      }
    });

    let budgetTracking = (totalExpense / budget) * 100;

    if (budgetTracking >= 100) {
      return res.status(200).json({
        success: true,
        message: "Warning: You have reached or exceeded your budget!",
        budgetTracking: `${budgetTracking.toFixed(2)}% of your budget used.`,
      });
    } else if (budgetTracking >= 90) {
      return res.status(200).json({
        success: true,
        message: "Alert: You have spent over 90% of your budget!",
        budgetTracking: `${budgetTracking.toFixed(2)}% of your budget used.`,
      });
    } else if (budgetTracking >= 50) {
      return res.status(200).json({
        success: true,
        message: "You have spent over 50% of your budget.",
        budgetTracking: `${budgetTracking.toFixed(2)}% of your budget used.`,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "You are within your budget.",
        budgetTracking: `${budgetTracking.toFixed(2)}% of your budget used.`,
      });
    }
  } catch (error) {
    console.error("Error in BudgetTracker:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = BudgetTracker;
