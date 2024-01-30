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
	},
	doc:{
		type: Sequelize.JSON,
		allowNull: false
	}
}, {
  timestamps: true,
  createdAt: 'ts_create',
  updatedAt: 'ts_update',
});

Order.sync();

const createOrder = async ({ userId, products, totalPrice, totalQuantity }) => {
	const jsonData = { userId, products, totalPrice, totalQuantity };
  const order = await Order.create({
    userId,
    products,
    totalPrice,
    totalQuantity,
		doc: jsonData
  });

  return order;
};

module.exports = {
	Order,
  createOrder
};
