const Sequelize = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize({
  database: config.database.dbname,
  username: config.database.username,
  password: config.database.password,
  dialect: config.database.dialect,
});

const Order = sequelize.define("orders", {
  userId: {
		type: Sequelize.STRING,
  	allowNull: false,
	},
	products: {
		type: Sequelize.JSON,
		allowNull: false
	},
	totalPrice: {
		type: Sequelize.DOUBLE,
	},
	totalQuantity: {
		type: Sequelize.INTEGER
	}
});

Order.sync();

const createOrder = async ({ userId, products, totalPrice, totalQuantity }) => {
  const order = await Order.create({
    userId,
    products,
    totalPrice,
    totalQuantity,
  });

  return order;
};

module.exports = {
	Order,
  createOrder
};
