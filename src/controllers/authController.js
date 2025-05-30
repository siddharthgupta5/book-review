const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Helper: Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ success: true, token });
};

// @desc    Register user
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};