import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'brand'
    });

    // const token = generateToken(user._id);

    successResponse(res, 201, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return errorResponse(res, 400, 'Please provide email and password');
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    successResponse(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    successResponse(res, 200, 'User retrieved successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    next(error);
  }
}
