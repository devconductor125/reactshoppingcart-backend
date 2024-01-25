const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User, getUser, createUser } = require('../models/userModel'); 
const config = require('../config/config');

const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password: hashedPassword });
    res.json({ user, msg: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating the user' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUser({ email });
    console.log("User", user);
    if (!user) {
      return res.status(401).json({ message: 'No such user found' });
    }
    await bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id };
        const token = jwt.sign(payload, config.jwtSecret);
        res.json({ msg: 'ok', token });
      } else {
        res.status(401).json({ msg: 'Password is incorrect' });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: 'Profile data', user: req.user });
});

module.exports = router;