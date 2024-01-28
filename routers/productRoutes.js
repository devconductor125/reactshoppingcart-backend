const express = require("express");
const passport = require("passport");
const config = require("../config/config");
const { Product, createProduct, getProduct, getAllProducts } = require('../models/productModel');

const router = express.Router();

router.post(
	"/create",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const {url, idDoc, _type, codigo, precio, precioCaja, description, unidadesCaja} = req.body;
		const data = {url, idDoc, _type, codigo, precio, precioCaja, description, unidadesCaja};
		const product = await createProduct({data});

		res.json({
      product, 
      msg: 'Product created successfully',
      code: 'success'
    });
	}
);

router.get(
	"/getall",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const products = await getAllProducts();
		res.json({
      products, 
      msg: 'All products',
      code: 'success'
    });
	}
);

router.post(
	"/getproduct",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const product = await getProduct({id: req.body.productId});
		res.json({
      product, 
      msg: 'Product',
      code: 'success'
    });
	}
);
module.exports = router;
