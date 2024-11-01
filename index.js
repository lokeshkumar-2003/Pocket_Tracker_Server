const express = require("express");
const DBConnection = require("./DbConfig/DatabaseConfig.js");
const cors = require("cors");
const AuthRoute = require("./Router/AuthRouter.js");
const TransactionRoute = require("./Router/TransactionRouter.js");
const AnalyticsRoute = require("./Router/AnalyticsRouter.js");
const ProfileRoute = require("./Router/ProfileRouter.js");
const NotificationRoute = require("./Router/NotificationRouter.js");
const ReportRoute = require("./Router/ReportRouter.js");

require("dotenv").config();
const app = express();

app.use(express.json());
const { PORT } = process.env;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", AuthRoute);
app.use("/api", ProfileRoute);
app.use("/api", TransactionRoute);
app.use("/api", AnalyticsRoute);
app.use("/api", NotificationRoute);
app.use("/api", ReportRoute);

app.listen(PORT, () => {
  DBConnection();
});
