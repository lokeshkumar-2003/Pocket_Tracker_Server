const router = require("express").Router();
const AddTransaction = require("../Controller/TransactionController/AddTransaction.js");
const AllTransaction = require("../Controller/TransactionController/AllTransaction.js");
const DeleteTransaction = require("../Controller/TransactionController/DeleteTransaction.js");
const UpdateTransaction = require("../Controller/TransactionController/UpdateTransaction.js");
const FilteredTransaction = require("../Controller/TransactionController/FilteredTransaction.js");

router.post("/transaction/:userId", AddTransaction);
router.get("/transactions/:userId", AllTransaction);
router.post("/transactions/filter/:userId", FilteredTransaction);
router.delete("/transaction/:userId/:transId", DeleteTransaction);
router.put("/transaction/:userId/:transId", UpdateTransaction);

module.exports = router;
