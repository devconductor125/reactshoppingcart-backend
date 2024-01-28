const express = require("express");
const passport = require("passport");
const config = require("../config/config");
const {
  Cart,
  createOrUpdateCart,
  updateCartByUserId,
  getAllCarts,
  getCartByUserId,
  clearCartByUserId,
} = require('../models/cartModel');

const router = express.Router();

router.post(
	"/creatOrUpdate",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		const userId = req.user.username;
		const { products, totalPrice, totalProducts, totalQuantity} = req.body;
		const {cart, created} = await createOrUpdateCart({userId, products, totalPrice, totalProducts, totalQuantity});
		res.json({
      cart, 
      msg: created ? 'Cart created successfully': 'Cart updated successfully',
      code: 'success'
    });
	}
);

router.get(
	"/getCart",
	passport.authenticate('jwt', {session: false}),
	async (req, res) => {
		const userId = req.user.username;
		const cart = await getCartByUserId(userId);
		if(cart) {
			res.json({
				cart, 
				msg: userId+"'s Cart",
				code: 'success'
			});
		}else {
			res.status(401).json({
				msg: 'No cart data',
				code: 'error'
			});
		}
		
	}
)

router.post(
	"/clearCart",
	passport.authenticate('jwt', {session: false}),
	async (req, res) => {
		const userId = req.user.username;
		const cart = await clearCartByUserId(userId);

		res.json({
      cart, 
      msg: 'Clear successfully',
      code: 'success'
    });
	}
)

module.exports = router;
