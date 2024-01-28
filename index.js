const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {getUser}  = require('./models/userModel');
const config = require('./config/config');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routers/authRoutes');
const productRoutes = require('./routers/productRoutes');
const cartRoutes = require('./routers/cartRouters');
const orderRoutes = require('./routers/orderRoutes');

const app = express();
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.jwtSecret || 'secret';

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  try {
    const user = await getUser({ id: jwt_payload.id });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.listen(config.serverPort, () => {
  console.log(`Express is running on port ${config.serverPort || 8080}`);
});