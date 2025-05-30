const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all books
exports.getBooks = async (req, res, next) => {
  try {
    let query;

    // Filtering
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Book.find(JSON.parse(queryStr));

    // Selecting fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Book.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const books = await query;

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single book
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('reviews');

    if (!book) {
      return next(new ErrorResponse(`Book not found with ID ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create book
exports.createBook = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

// @desc    Update book
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return next(new ErrorResponse(`Book not found with ID ${req.params.id}`, 404));
    }

    if (book.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this book', 401));
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return next(new ErrorResponse(`Book not found with ID ${req.params.id}`, 404));
    }

    if (book.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this book', 401));
    }

    await book.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Search books
exports.searchBooks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return next(new ErrorResponse('Please provide a search query', 400));
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);

    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (err) {
    next(err);
  }
};