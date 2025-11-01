const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync');
const ExpressError = require('../utils/ExpressError');
const User = require('../MODELS/user');
const passport = require('passport');
//routes
router.get('/register', wrapAsync(async (req, res) => {
  res.render('users/signup.ejs');
}));

router.post('/register', wrapAsync(async (req, res, next) => {
try {let {username,email,password} = req.body;
const user = new User({username,email});
const registeredUser = await User.register(user, password);
console.log(registeredUser);
req.flash('success', 'Account created successfully! Welcome to Wanderlust!');
res.redirect('/listings');
} catch(e) {
  req.flash('error', e.message);
  res.redirect('register');
}
}));
router.get('/login', wrapAsync(async (req, res) => {
  res.render('users/login.ejs');
}));
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(async (req, res) => {
  req.flash('success', `Welcome back ${req.user.username}! to Wanderlust!`);
  res.redirect('/listings');
}));
module.exports = router;