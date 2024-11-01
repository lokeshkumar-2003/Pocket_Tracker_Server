const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_CONNSTR } = process.env;

const DBConnection = () => {
  mongoose
    .connect(MONGODB_CONNSTR)
    .then(() => {
      console.log("Database connected successfully....");
    })
    .catch((err) => {
      console.log("Something went wrong while connecting to database....");
      console.log(err.message);
    });
};

module.exports = DBConnection;
