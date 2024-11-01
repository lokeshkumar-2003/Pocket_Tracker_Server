const router = require("express").Router();
const GaugeChartControllers = require("../Controller/AnalyticsControllers/gaugeChartControllers.js");
const TimeLineChartControllers = require("../Controller/AnalyticsControllers/timeLineChartControllers.js");
const {
  SummeryChartController,
} = require("../Controller/AnalyticsControllers/summeryChartControllers.js");
const {
  PieChartController,
} = require("../Controller/AnalyticsControllers/pieChartContollers.js");

router.get("/analytics/summery/:userId", SummeryChartController);
router.post("/analytics/piechart/:userId", PieChartController);
router.post("/analytics/timelinechart/:userId", TimeLineChartControllers);
router.get("/analytics/guage/:userId", GaugeChartControllers);

module.exports = router;
