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
  type: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  doc: {
    type: Sequelize.JSON,
    allowNull: false,
  }
}, {
  timestamps: true,
  createdAt: 'ts_create',
  updatedAt: 'ts_update',
});

User.sync();

const createUser = async ({ username, password, type }) => {
  return await User.create({ username, password, type, doc: {username, password, type} });
};

const getUser = async (obj) => {
  return await User.findOne({
    where: obj,
  });
};

module.exports = { User, createUser, getUser };
