const router = require("express").Router();
const {
  ReportGenerator,
} = require("../Controller/ReportControllers/sampleReport.js");

router.post("/report/:userId", ReportGenerator);

module.exports = router;
