const Sequelize = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize({
  database: config.database.dbname,
  username: config.database.username,
  password: config.database.password,
  dialect: config.database.dialect,
});

const Product = sequelize.define("articulos", {
	doc: {
    type: Sequelize.JSON,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  codigo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  precio: {
    type: Sequelize.DOUBLE,
  }
}, {
  timestamps: true,
  createdAt: 'ts_create',
  updatedAt: 'ts_update',
});

Product.sync();

const createProduct = async ({ data }) => {
  return await Product.create({ doc: data, codigo: data.codigo, precio: data.precio, description: data.description });
};

const getProduct = async (obj) => {
  const product = await Product.findOne({
    where: obj,
    attributes: ['id', 'doc', 'codigo', 'precio', 'description']
  });

  if(product == null) {
    return {}
  }

  const productDetail = await product?.get({plain: true});
  const productDoc = JSON.parse(productDetail?.doc);

  return {
    ...productDetail,
    ...productDoc,
  }
};

const getAllProducts = async () => {
  const products = await Product.findAll({
    attributes: ['id', 'doc', 'codigo', 'precio', 'description']
  });
  return products.map(product => ({
    ...product.get(),
    doc: JSON.parse(product.doc)
  }));
};

module.exports = { Product, createProduct, getProduct, getAllProducts };
