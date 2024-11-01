const bcrypt = require("bcrypt");
require("dotenv").config();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.ROUNDS));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const hashCompare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  hashCompare,
};
