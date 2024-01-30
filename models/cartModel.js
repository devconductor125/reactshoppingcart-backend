const Sequelize = require("sequelize");
const config = require("../config/config");
const Product = require('./productModel')

const sequelize = new Sequelize({
  database: config.database.dbname,
  username: config.database.username,
  password: config.database.password,
  dialect: config.database.dialect,
});

const Cart = sequelize.define("cart", {
  userId: {
		type: Sequelize.STRING,
		unique: true,
  	allowNull: false,
	},
	products: {
		type: Sequelize.JSON,
		allowNull: false
	},
	totalPrice: {
		type: Sequelize.DOUBLE,
	},
	totalProducts: {
		type: Sequelize.INTEGER
	},
	totalQuantity: {
		type: Sequelize.INTEGER
	},
  doc: {
    type: Sequelize.JSON,
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'ts_create',
  updatedAt: 'ts_update',
});


Cart.sync();

const createOrUpdateCart = async ({ userId, products, totalPrice, totalProducts, totalQuantity }) => {
  const jsonData = { userId, products, totalPrice, totalProducts, totalQuantity };
  const [cart, created] = await Cart.upsert({
    userId,
    products,
    totalPrice,
    totalProducts,
    totalQuantity,
    doc: jsonData
  }, {
    returning: true,
    where: { userId: userId },
  });

  if (created) {
    console.log('A new cart has been created');
  } else {
    console.log('An existing cart has been updated');
  }
  return {cart, created};
};

const updateCartByUserId = async (userId, updateData) => {
	console.log(updateData)
  return await Cart.update(updateData, {
    where: { userId },
  });
};

const getAllCarts = async () => {
  return await Cart.findAll();
};

const getCartByUserId = async (userId) => {
  const userCart = await Cart.findOne({
    where: { userId },
    attributes: ['products', 'totalPrice', 'totalProducts', 'totalQuantity'],
  });

  if (!userCart) {
    return null;
  }

  const cartData = userCart?.get({ plain: true });

  const productsInCart = JSON.parse(cartData.products);

  const productDetails = await Promise.all(
    productsInCart.map(async (item) => {
      const product = await Product.getProduct({id: item.productId});
      return {
        ...item,
        productDetail: product ? product : null,
      };
    })
  );

  const returnData = {
    ...cartData, 
    products: productDetails
  }

  return returnData;

};

const clearCartByUserId = async (userId) => {
  return await Cart.update(
    { products: [], totalPrice: 0, totalProducts: 0, totalQuantity: 0, doc: {} },
    { where: { userId } }
  );
};

module.exports = {
	Cart,
  createOrUpdateCart,
  updateCartByUserId,
  getAllCarts,
  getCartByUserId,
  clearCartByUserId,
};
