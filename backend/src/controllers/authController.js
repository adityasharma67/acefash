const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        preferredSport: user.preferredSport,
        defaultShippingAddress: user.defaultShippingAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        preferredSport: user.preferredSport,
        defaultShippingAddress: user.defaultShippingAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      preferredSport: req.body.preferredSport,
      defaultShippingAddress: req.body.defaultShippingAddress,
    };

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (updates.name !== undefined) user.name = updates.name;
    if (updates.email !== undefined) user.email = updates.email;
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.preferredSport !== undefined) user.preferredSport = updates.preferredSport;
    if (updates.defaultShippingAddress !== undefined) {
      user.defaultShippingAddress = {
        ...user.defaultShippingAddress,
        ...updates.defaultShippingAddress,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        preferredSport: updatedUser.preferredSport,
        defaultShippingAddress: updatedUser.defaultShippingAddress,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, logoutUser, updateProfile };
