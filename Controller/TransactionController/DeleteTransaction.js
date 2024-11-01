const Transaction = require("../../Model/Transaction.js");

const DeleteTransaction = async (req, res) => {
  const { transId, userId } = req.params;

  if (!transId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Transaction Id and User Id are required",
    });
  }

  try {
    const transactionRecords = await Transaction.findOne({ userId });

    if (!transactionRecords) {
      return res.status(404).json({
        success: false,
        message: "User not found or no transactions available",
      });
    }

    const originalLength = transactionRecords.transactions.length;

    transactionRecords.transactions = transactionRecords.transactions.filter(
      (transaction) => transaction._id.toString() !== transId.toString()
    );

    if (transactionRecords.transactions.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    await transactionRecords.save();

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete transaction due to server error",
    });
  }
};

module.exports = DeleteTransaction;
