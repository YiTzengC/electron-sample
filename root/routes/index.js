var express = require('express')
var router = express.Router()
const User = require('../models/user');
const passport = require('passport');
const isAuthenticated = require('./auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    user: req.user
  });
});

/* GET signup page. */
router.get('/sign-up', function (req, res, next) {
  res.render('sign-up', {
    title: 'Sign-up'
  });
});

//create account
router.post('/sign-up', function (req, res, next) {
  User.register(
    new User({
      username: req.body.email,
      name: req.body.name
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(`Create user error: ${err}`);
        res.redirect('/sign-up');

      } else {
        req.login(newUser, (err) => {
          if (err)
            res.redirect('/sign-in');
          else
            res.redirect('/events');
        });
      }
    }
  );
});

/* GET signin page. */
router.get('/sign-in', function (req, res, next) {

  let loginFailure = req.session.messages || [];
  // clear session
  req.session.messages = [];
  res.render('sign-in', {
    loginFailure: loginFailure
  });
});

router.post('/sign-in', passport.authenticate('local', {
  successRedirect: '/events',
  failureRedirect: '/sign-in',
  failureMessage: 'Invalid User'
}));

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/sign-in');
});

module.exports = router;