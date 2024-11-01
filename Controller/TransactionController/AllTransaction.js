const Transaction = require("../../Model/Transaction.js");

const AllTransaction = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(404).json({
      success: false,
      message: "User id is required",
    });
  }

  const AllTransaction = await Transaction.findOne({ userId });

  const transactionList = AllTransaction?.transactions;
  if (AllTransaction) {
    res.status(200).json({
      success: true,
      transactionList,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Transactions not found",
    });
  }
};

module.exports = AllTransaction;
