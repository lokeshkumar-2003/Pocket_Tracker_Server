const Transaction = require("../../Model/Transaction.js");

const AddTransaction = async (req, res) => {
  const { userId } = req.params;

  const { amount, description, category, transactionType } = req.body;

  if (!amount || !description || !category || !transactionType) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    let existTransaction = await Transaction.findOne({ userId });

    if (existTransaction) {
      existTransaction.transactions.push({
        amount,
        description,
        category,
        transactionType,
      });

      await existTransaction.save();

      return res.status(201).json({
        success: true,
        message: "Transaction added successfully",
        transaction: existTransaction,
      });
    } else {
      const newTransaction = new Transaction({
        userId: userId,
        transactions: [
          {
            amount,
            description,
            category,
            transactionType,
          },
        ],
      });

      await newTransaction.save();

      return res.status(201).json({
        success: true,
        message: "Transaction added successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to add transaction due to server error",
    });
  }
};

module.exports = AddTransaction;
