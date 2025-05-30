const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

router.route('/search')
  .get(searchBooks);

module.exports = router;