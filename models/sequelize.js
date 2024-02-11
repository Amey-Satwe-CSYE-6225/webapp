const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  database: "Assignment_1",
  username: "root",
  password: "root",
  host: "127.0.0.1",
  dialect: "mysql",
});

module.exports = sequelize;
