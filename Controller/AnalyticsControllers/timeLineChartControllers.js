const Transaction = require("../../Model/Transaction.js");

const TimeLineChartControllers = async (req, res) => {
  const { userId } = req.params;
  const { yearMonth } = req.body;

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "User id is required",
    });
  }

  if (!yearMonth) {
    return res.status(404).json({
      success: false,
      message: "Month and year are required",
    });
  }

  const userTransactions = await Transaction.findOne({ userId });

  if (!userTransactions || !userTransactions.transactions) {
    return res.status(404).json({
      success: false,
      message: "No transactions found for the user",
    });
  }

  const monthTransactions = [];
  const transactionRecords = userTransactions.transactions;

  const [year, month] = yearMonth.split("-").map(Number);
  console.log(year, month);

  const dayOfMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i <= dayOfMonth; i++) {
    monthTransactions.push({
      income: 0,
      expense: 0,
      date: i.toString(),
    });
  }

  transactionRecords.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionYearMonth = transactionDate.toISOString().slice(0, 7);

    if (transactionYearMonth === yearMonth) {
      const day = transactionDate.getUTCDate().toString();

      let existingDayTransaction = monthTransactions.find(
        (entry) => entry.date === day
      );

      if (existingDayTransaction) {
        if (transaction.transactionType === "Expense") {
          existingDayTransaction.expense += transaction.amount;
        } else {
          existingDayTransaction.income += transaction.amount;
        }
      }
    }
  });

  return res.status(200).json({
    success: true,
    areaChartValue: monthTransactions,
  });
};

module.exports = TimeLineChartControllers;
