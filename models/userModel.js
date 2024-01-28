const Sequelize = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize({
  database: config.database.dbname,
  username: config.database.username,
  password: config.database.password,
  dialect: config.database.dialect,
});

const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  doc: {
    type: Sequelize.JSON,
    allowNull: false,
  }
});

User.sync();

const createUser = async ({ username, password, jsonData }) => {
  return await User.create({ username, password, doc: jsonData });
};

const getUser = async (obj) => {
  return await User.findOne({
    where: obj,
  });
};

module.exports = { User, createUser, getUser };
