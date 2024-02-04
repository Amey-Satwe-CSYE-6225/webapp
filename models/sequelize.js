import Sequelize from "sequelize";
import "dotenv/config";
const sequelize = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.UNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
});

export default sequelize;
