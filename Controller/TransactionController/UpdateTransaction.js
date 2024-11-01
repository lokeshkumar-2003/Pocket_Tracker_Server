const Transaction = require("../../Model/Transaction.js");

const UpdateTransaction = async (req, res) => {
  const { userId, transId } = req.params;
  const { amount, description, category, transactionType, gender } = req.body;

  console.log(1);
  // Validate required fields
  if (!transId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Transaction ID and User ID are required.",
    });
  }

  if (!amount || !description || !category || !transactionType) {
    return res.status(400).json({
      success: false,
      message:
        "All fields (amount, description, category, transaction type) are required.",
    });
  }

  try {
    const userTransaction = await Transaction.findOne({ userId });

    if (!userTransaction) {
      return res.status(404).json({
        success: false,
        message: "User or transaction not found.",
      });
    }

    const transactionToUpdate = userTransaction.transactions.find(
      (transaction) => transaction._id.toString() === transId
    );

    if (!transactionToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
      });
    }

    // Update transaction fields
    transactionToUpdate.amount = parseFloat(amount);
    transactionToUpdate.description = description;
    transactionToUpdate.category = category;
    transactionToUpdate.transactionType = transactionType;
    transactionToUpdate.gender = gender;

    await userTransaction.save();

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      transaction: transactionToUpdate,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update transaction due to a server error.",
    });
  }
};

module.exports = UpdateTransaction;
