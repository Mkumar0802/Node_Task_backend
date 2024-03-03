var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var mongo=require('./dbconnection/connection')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// Import MongoDB connection
var mongo = require('./dbconnection/connection');
var app = express();
var controller = require('./controller/user')
const routes = require("./routes/allroutes.js");



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var mongo=require('./dbconnection/connection.js')
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/api', controller);
app.use("/",routes)



mongo.connect()

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



const PORT = process.env.PORT || 4040;

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



app.listen(PORT, () => {
  var datetime = new Date();
  console.log(datetime.toISOString().slice(0, 10));
  console.log(`Server is running on port ${PORT}.`);
});








module.exports = app;
