const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const indexRouter = require('./routes/index');
const postRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');
require('dotenv').config()
const MongoDBStore = require('express-mongodb-session')(session);
const app = express();

// Creates a new MongoDBStore.
const store = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'sessions'
})

store.on('error', function (error) {
  console.log(error);
});

// Use the `express-session` middleware
app.use(session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 Day
  },
  store: store,
  secret: 'joseanblog09dsd90897sdsd97cvcv',  // a secret string used to sign the session ID cookie
  resave: false,  // don't save session if unmodified
  saveUninitialized: true  // don't create session until something stored
}))

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postRouter);
app.use('/admin', adminRouter);


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
  res.render('404');
});

module.exports = app;
