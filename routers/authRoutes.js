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
    const { username, password, confirmPassword, userType } = req.body;
    
    const existingUser = await getUser({ username });
    if (existingUser) {
      return res.status(401).json({
        msg: 'User is already exist',
        code: 'user_exists'
      });
    }

    if (password.length < 6) {
      return res.status(401).json({
        msg: 'Password must be at least 6 characters',
        code: 'password_short'
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        msg: 'Passwords do not match',
        code: 'password_mismatch'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ username, password: hashedPassword, jsonData: {username, password, type:userType} });

    console.log(newUser)

    const payload = { id: newUser.id, username: newUser.username };
    const token = jwt.sign(payload, config.jwtSecret);
    res.json({
      newUser, 
      msg: 'Account created successfully',
      code: 'success',
      token
    });
    
  } catch (error) {
    res.status(500).json({
      msg: 'Error creating the user',
      code: 'error'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUser({ username });
    if (!user) {
      return res.status(401).json({ 
        msg: 'User not found',
        code: 'user_not_found'
      });
    }
    await bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, username: user.name };
        const token = jwt.sign(payload, config.jwtSecret);
        res.json({
          msg: 'ok',
          code: 'login_success',
          token
        });
      } else {
        res.status(401).json({
          msg: 'Password is incorrect',
          code: 'password_incorrect'
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Login failed',
      code: 'error'
    });
  }
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    msg: 'Profile data',
    code: 'success',
    user: req.user
  });
});

module.exports = router;