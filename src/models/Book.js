const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters'],
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Thriller',
      'Romance',
      'Biography',
      'History',
      'Self-Help',
      'Other',
    ],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please add a published year'],
    min: [1000, 'Year must be after 1000'],
    max: [new Date().getFullYear(), 'Year cannot be in the future'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to get average rating of a book
BookSchema.statics.getAverageRating = async function (bookId) {
  const obj = await this.aggregate([
    {
      $match: { _id: bookId },
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'book',
        as: 'reviews',
      },
    },
    {
      $project: {
        averageRating: { $avg: '$reviews.rating' },
      },
    },
  ]);

  try {
    await this.model('Book').findByIdAndUpdate(bookId, {
      averageRating: obj[0]?.averageRating || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save or delete of a review
BookSchema.post('save', function () {});
BookSchema.post('deleteOne', { document: true }, function () {});

module.exports = mongoose.model('Book', BookSchema);