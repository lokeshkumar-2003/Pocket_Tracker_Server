const Transaction = require("../../Model/Transaction.js");
const Profile = require("../../Model/Profile.js");

module.exports.SummeryChartController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const userTransactions = await Transaction.findOne({ userId });

    const profileRecords = await Profile.findOne({ userId });

    let totalIncome = 0;
    let totalExpense = 0;

    if (userTransactions) {
      userTransactions.transactions.forEach((transaction) => {
        if (transaction.transactionType === "Expense") {
          totalExpense += transaction.amount;
        } else if (transaction.transactionType === "Income") {
          totalIncome += transaction.amount;
        }
      });
    } else {
      totalExpense = 0;
      totalIncome = 0;
    }

    const currentBalance = totalIncome - totalExpense;

    const budgetGoal = profileRecords?.budgetGoal || 0;

    let profile =
      profileRecords?.gender === "male"
        ? "https://www.shareicon.net/data/2016/05/24/770137_man_512x512.png"
        : "https://tse1.mm.bing.net/th?id=OIP.Sw0g2adwtwCJAbIAveYGbgHaHa&pid=Api&P=0&h=180";

    return res.status(200).json({
      success: true,
      summary: {
        profile,
        totalExpense,
        totalIncome,
        currentBalance,
        budgetGoal,
      },
    });
  } catch (error) {
    console.error("Error in SummerChartController:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
