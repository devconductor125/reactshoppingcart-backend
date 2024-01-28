const express = require("express");
const passport = require("passport");
const config = require("../config/config");
const {
  Order,
  createOrder
} = require('../models/orderModel');
const { clearCartByUserId } = require("../models/cartModel");

const router = express.Router();

router.post("/createOrder",
  passport.authenticate('jwt', {session: false}),
  async (req, res) => {
    const userId = req.user.username;
		const { products, totalPrice, totalQuantity} = req.body;
    const newOrder = await createOrder({userId, products, totalPrice, totalQuantity});

    if(newOrder) {
      await clearCartByUserId(userId);
      res.json({
        newOrder, 
        msg: 'Order created successfully',
        code: 'success'
      });
    }
})

module.exports = router;
