const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Body parser
app.use(express.json());

// // Dev logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// Enable CORS
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books', reviewRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;