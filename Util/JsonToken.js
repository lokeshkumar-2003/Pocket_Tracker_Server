const jwt = require("jsonwebtoken");
const { SALT } = process.env;
require("dotenv").config();

module.exports.JsonToken = async (userId) => {
  const token = await jwt.sign({ id: userId }, SALT, { expiresIn: "1d" });

  return token;
};
