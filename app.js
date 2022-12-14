var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var vendorRouter = require('./routes/vendor');
var adminRouter = require('./routes/admin');
var session = require('express-session');
const nocache = require("nocache");
const passport = require('passport');
const dotenv= require('dotenv')
dotenv.config()
var app = express();
app.use(nocache());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({helpers:{inc: function(value, option){
  return parseInt(value)+1;
}},extname: 'hbs',defaultLayout: 'layout', layoutsDir:__dirname + '/views/layout', partialDir:__dirname + '/views/partials'})); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "bro", resave:false,saveUninitialized:true, cookie: { maxAge: 7000000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/vendor', vendorRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.render('user/not-found')
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
