const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const routes = require('./routes/allroutes'); // Import custom routes

const app = express();

// Middleware setup
app.use(cors());
app.use(logger('dev'));
app.use(express.json()); // Ensure JSON parser is used
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Route setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', routes); // Use custom routes for API

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handler
app.use(function(err, req, res, next) {
  console.error('Error handler:', err.message);

  // Set locals, only providing error in development
  const errorResponse = {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  };

  // Send JSON response
  res.status(err.status || 500).json(errorResponse);
});

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
