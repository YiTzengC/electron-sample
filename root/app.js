const mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var eventRouter = require('./routes/event');
var accountRouter = require('./routes/account');
// var sportRouter = require('./routes/sport');

const passport = require('passport')
const session = require('express-session')

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//authentication configuration
app.use(session({
  secret: 'comp2068',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
//link passport to user model
const User = require('./models/user')
// configure strategy
passport.use(User.createStrategy())
//configure passport to w/r user info 
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/', indexRouter);
app.use('/events', eventRouter);
app.use('/account', accountRouter);
// app.use('/sports', sportRouter);

const os = require('os');
//mongodb connection
let connectString = 'mongodb+srv://admin:511058ytC@comp2068.kp8ew.mongodb.net/comp2068';


// if (os.hostname().includes('local')) {
//   // local connection
//   connectString = 'mongodb://localhost:27017/test';
// }


mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then((message) => {
  console.log("connected to mongo")
}).catch((err) => {
  console.log(`mongo connection error: ${err}`)
});

const hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'account'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;