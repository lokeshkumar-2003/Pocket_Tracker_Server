let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
const os = require("os"); // To get user's home directory
const Transactions = require("../../Model/Transaction");
const Profile = require("../../Model/Profile");

module.exports.ReportGenerator = async (req, res) => {
  const { userId } = req.params;
  const { yearMonth } = req.body;

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "User ID required",
    });
  }

  try {
    const transactions = await Transactions.findOne({ userId: userId });

    let optionTransaction = [];

    const userDetails = await Profile.findOne({ userId });
    const userData = {
      name: userDetails ? userDetails.name : "Unknown User",
    };

    console.log(userData);

    if (transactions && transactions.transactions) {
      transactions.transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionYearMonth = transactionDate.toISOString().slice(0, 7); // Extract "YYYY-MM"

        if (transactionYearMonth === yearMonth) {
          optionTransaction.push({
            amount: transaction.amount,
            description: transaction.description,
            date: transactionDate.toISOString().slice(0, 10), // "YYYY-MM-DD"
            category: transaction.category,
            transactionType: transaction.transactionType,
            _id: transaction._id,
          });
        }
      });
    }

    const message =
      optionTransaction.length === 0
        ? `No transactions in the selected month ${yearMonth}.`
        : "";
    ejs.renderFile(
      path.join(__dirname, "./views/", "report-template.ejs"),
      {
        transactions: optionTransaction,
        userDetails: userData,
        message: message,
      },
      (err, html) => {
        if (err) {
          return res.send(err);
        } else {
          let options = {
            height: "11.25in",
            width: "8.5in",
            header: {
              height: "20mm",
            },
            footer: {
              height: "20mm",
            },
          };

          // Get path to downloads folder
          const downloadsFolder = path.join(os.homedir(), "Downloads");
          const filePath = path.join(downloadsFolder, "report.pdf");

          pdf.create(html, options).toFile(filePath, (err, data) => {
            if (err) {
              res.status(400).send(err);
            } else {
              res.status(201).send({
                message: "Downloaded Transaction Recipet Successfully.",
                success: true,
              });
            }
          });
        }
      }
    );
  } catch (error) {
    console.error("Error in ReportGenerator:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
