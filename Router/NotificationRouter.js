const router = require("express").Router();

const BudgetTracker = require("../Controller/NotificationControllers/BudgetTracker");
const LargeTransaction = require("../Controller/NotificationControllers/LargeTransaction");

router.get("/notification/budgettrack/:userId", BudgetTracker);
router.get("/notification/largetrans/:userId", LargeTransaction);

module.exports = router;
