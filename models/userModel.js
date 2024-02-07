const sequelize = require("./sequelize.js");
const DataTypes = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      readOnly: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      writeOnly: true,
      select: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    account_created: {
      type: DataTypes.DATE,
    },
    account_updated: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    createdAt: "account_created",
    updatedAt: "account_updated",
  } //https://stackoverflow.com/questions/39587767/disable-updatedat-update-date-field-in-sequelize-js
);

module.exports = User;
