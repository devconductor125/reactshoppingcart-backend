const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const {getUser}  = require('./models/userModel');
const config = require('./config/config');

require('dotenv').config();

const authRoutes = require('./routers/authRoutes'); // Import the routes

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Express is running on port 3000');
});