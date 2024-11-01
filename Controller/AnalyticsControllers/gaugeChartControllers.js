const Profile = require("../../Model/Profile.js");
const Transaction = require("../../Model/Transaction.js");

const GaugeChartController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    const { budgetGoal } = userProfile;

    const transactionList = await Transaction.findOne({ userId });

    if (!transactionList || !transactionList.transactions) {
      return res.status(404).json({
        success: false,
        message: "Transactions not found",
      });
    }

    let totalExpense = 0;

    // Calculate total expenses
    transactionList.transactions.forEach((trans) => {
      if (trans.transactionType === "Expense") {
        totalExpense += trans.amount;
      }
    });

    // Check if budgetGoal is defined
    if (budgetGoal === undefined || budgetGoal === null) {
      return res.status(400).json({
        success: false,
        message: "Budget goal is not set",
      });
    }

    let overAllSpent = ((totalExpense / budgetGoal) * 100).toFixed(0);
    let remainAmount = budgetGoal - totalExpense;

    return res.status(200).json({
      success: true,
      overAllSpent,
      remainAmount,
    });
  } catch (error) {
    console.error("Error fetching gauge chart data:", error); // Log the error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = GaugeChartController;
