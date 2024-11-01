const Transaction = require("../../Model/Transaction.js");

// Function to calculate default income and expense pie chart values
const PieValueConverterForDefault = (transactionRecords) => {
  let income = 0;
  let expense = 0;

  transactionRecords.transactions.forEach((trans) => {
    if (trans.transactionType === "Expense") {
      expense += trans.amount;
    } else {
      income += trans.amount;
    }
  });

  const totalAmount = income + expense;

  if (totalAmount === 0) {
    return {
      pieExpenseValue: 0,
      pieIncomeValue: 0,
    };
  }

  const pieChartValue = 360;
  const pieChartDegree = pieChartValue / totalAmount;

  const pieIncomeValue = (pieChartDegree * income).toFixed(2);
  const pieExpenseValue = (pieChartDegree * expense).toFixed(2);

  return {
    pieExpenseValue,
    pieIncomeValue,
  };
};

// Function to calculate pie values for categories
const PieValueConverterForCategory = (transactionRecords, type) => {
  // Expense categories
  let foodAndGroceries = 0;
  let rentAndHousing = 0;
  let transportation = 0;
  let entertainment = 0;
  let shopping = 0;
  let education = 0;
  let expenseOthers = 0;

  // Income categories
  let salary = 0;
  let investments = 0;
  let businessIncome = 0;
  let incomeOthers = 0;

  transactionRecords.transactions.forEach((trans) => {
    const transType = trans.transactionType;
    const category = trans.category;

    if (transType === "Expense") {
      switch (category) {
        case "Food and Groceries":
          foodAndGroceries += trans.amount;
          break;
        case "Rent and Housing":
          rentAndHousing += trans.amount;
          break;
        case "Transportation":
          transportation += trans.amount;
          break;
        case "Entertainment":
          entertainment += trans.amount;
          break;
        case "Shopping":
          shopping += trans.amount;
          break;
        case "Education":
          education += trans.amount;
          break;
        case "Expense Others":
          expenseOthers += trans.amount;
          break;
      }
    } else if (transType === "Income") {
      switch (category) {
        case "Salary":
          salary += trans.amount;
          break;
        case "Investments":
          investments += trans.amount;
          break;
        case "Business Income":
          businessIncome += trans.amount;
          break;
        case "Income Others":
          incomeOthers += trans.amount;
          break;
      }
    }
  });

  const totalExpenses =
    foodAndGroceries +
    rentAndHousing +
    transportation +
    entertainment +
    shopping +
    education +
    expenseOthers;

  const totalIncome = salary + investments + businessIncome + incomeOthers;
  const totalAmount = type === "expense" ? totalExpenses : totalIncome;

  if (totalAmount === 0) {
    return {};
  }

  const pieChartValue = 360;
  const pieChartDegree = pieChartValue / totalAmount;

  if (type === "expense") {
    return {
      foodAndGroceries: (pieChartDegree * foodAndGroceries).toFixed(2),
      rentAndHousing: (pieChartDegree * rentAndHousing).toFixed(2),
      transportation: (pieChartDegree * transportation).toFixed(2),
      entertainment: (pieChartDegree * entertainment).toFixed(2),
      shopping: (pieChartDegree * shopping).toFixed(2),
      education: (pieChartDegree * education).toFixed(2),
      others: (pieChartDegree * expenseOthers).toFixed(2),
    };
  } else if (type === "income") {
    return {
      salary: (pieChartDegree * salary).toFixed(2),
      investments: (pieChartDegree * investments).toFixed(2),
      businessIncome: (pieChartDegree * businessIncome).toFixed(2),
      others: (pieChartDegree * incomeOthers).toFixed(2),
    };
  }

  return {};
};

module.exports.PieChartController = async (req, res) => {
  const { userId } = req.params;
  const { both, income, expense } = req.body;

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "User ID is required",
    });
  }

  const transactionRecords = await Transaction.findOne({ userId });

  if (!transactionRecords || transactionRecords.transactions.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Transactions not found",
    });
  }

  const { pieExpenseValue, pieIncomeValue } =
    PieValueConverterForDefault(transactionRecords);
  const totalAmount = parseFloat(pieIncomeValue) + parseFloat(pieExpenseValue);

  if (totalAmount === 0) {
    return res.status(200).json({
      success: true,
      pieValue: {
        income: 0,
        expense: 0,
      },
      message: "No income or expenses recorded.",
    });
  }

  if (both) {
    return res.status(200).json({
      success: true,
      pieValue: {
        income: pieIncomeValue,
        expense: pieExpenseValue,
      },
    });
  }

  if (income) {
    const pieIncomeValues = PieValueConverterForCategory(
      transactionRecords,
      "income"
    );
    return res.status(200).json({
      success: true,
      pieValue: pieIncomeValues,
    });
  }

  if (expense) {
    const pieExpenseValues = PieValueConverterForCategory(
      transactionRecords,
      "expense"
    );
    return res.status(200).json({
      success: true,
      pieValue: pieExpenseValues,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid request parameters.",
  });
};
