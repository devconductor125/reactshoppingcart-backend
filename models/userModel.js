const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize({
    database: config.database.dbname,
    username: config.database.username,
    password: config.database.password,
    dialect: config.database.dialect,
  });

// Define your User model here with Sequelize
const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
});

// Sync the model with the database
User.sync();

// Helper functions
const createUser = async ({ email, password }) => {
  return await User.create({ email, password });
};

const getUser = async obj => {
  return await User.findOne({
    where: obj,
  });
};

module.exports = { User, createUser, getUser };