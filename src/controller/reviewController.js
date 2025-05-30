const Review = require('../models/Review');
const Book = require('../models/Book');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get reviews for a book
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'username');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review
exports.addReview = async (req, res, next) => {
  try {
    req.body.book = req.params.bookId;
    req.body.user = req.user.id;

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return next(new ErrorResponse(`Book not found with ID ${req.params.bookId}`, 404));
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      book: req.params.bookId
    });

    if (existingReview) {
      return next(new ErrorResponse('You have already reviewed this book', 400));
    }

    const review = await Review.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse(`Review not found with ID ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this review', 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new ErrorResponse(`Review not found with ID ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this review', 401));
    }

    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};