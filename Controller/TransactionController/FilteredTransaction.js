const Transaction = require("../../Model/Transaction.js");

const FilteredTransaction = async (req, res) => {
  const { userId } = req.params;
  const { sortBy } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "User id is required",
      status: false,
    });
  }

  if (sortBy && sortBy !== "latest" && sortBy !== "oldest") {
    return res.status(400).json({
      message: "Please select either 'latest' or 'oldest' for sorting",
      status: false,
    });
  }

  try {
    const transaction = await Transaction.findOne({ userId });
    if (!transaction) {
      return res.status(404).json({
        message: "No transactions found for this user",
        status: false,
      });
    }

    let filteredTransactions = transaction.transactions;

    if (sortBy === "latest") {
      filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return res.status(200).json({
      message: "Transactions retrieved successfully",
      status: true,
      transactionList: filteredTransactions,
    });
  } catch (err) {
    console.error("Error retrieving transactions:", err);
    return res.status(500).json({
      message: "Unable to retrieve the transactions",
      status: false,
    });
  }
};

module.exports = FilteredTransaction;
