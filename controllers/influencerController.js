

import InfluencerProfile from '../models/InfluencerProfile.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createInfluencerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check if user role is influencer
    if (req.user.role !== 'influencer') {
      return errorResponse(res, 403, 'Only influencers can create profiles');
    }

    // Check if profile already exists
    const existingProfile = await InfluencerProfile.findOne({ userId });
    if (existingProfile) {
      return errorResponse(res, 400, 'Profile already exists for this user');
    }

    const profile = await InfluencerProfile.create({
      userId,
      ...req.body
    });

    const populatedProfile = await InfluencerProfile.findById(profile._id).populate('userId', 'name email profilePicture');

    successResponse(res, 201, 'Influencer profile created successfully', { profile: populatedProfile });
  } catch (error) {
    next(error);
  }
};

export const getInfluencerProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await InfluencerProfile.findById(id).populate('userId', 'name email profilePicture');

    if (!profile) {
      return errorResponse(res, 404, 'Influencer profile not found');
    }

    successResponse(res, 200, 'Profile retrieved successfully', { profile });
  } catch (error) {
    next(error);
  }
};

export const getAllInfluencers = async (req, res, next) => {
  try {
    const { category, minFollowers, platform, verified, page = 1, limit = 12 } = req.query;

    const query = {};

    if (category) {
      query.category = { $in: [category] };
    }

    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    if (minFollowers && platform) {
      const followerField = `followers.${platform}`;
      query[followerField] = { $gte: parseInt(minFollowers) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const profiles = await InfluencerProfile.find(query)
      .populate('userId', 'name email profilePicture')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await InfluencerProfile.countDocuments(query);

    successResponse(res, 200, 'Influencers retrieved successfully', {
      profiles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateInfluencerProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const profile = await InfluencerProfile.findById(id);

    if (!profile) {
      return errorResponse(res, 404, 'Profile not found');
    }

    // Check ownership
    if (profile.userId.toString() !== userId.toString()) {
      return errorResponse(res, 403, 'Not authorized to update this profile');
    }

    const updatedProfile = await InfluencerProfile.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'name email profilePicture');

    successResponse(res, 200, 'Profile updated successfully', { profile: updatedProfile });
  } catch (error) {
    next(error);
  }
};

export const deleteInfluencerProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const profile = await InfluencerProfile.findById(id);

    if (!profile) {
      return errorResponse(res, 404, 'Profile not found');
    }

    if (profile.userId.toString() !== userId.toString()) {
      return errorResponse(res, 403, 'Not authorized to delete this profile');
    }

    await InfluencerProfile.findByIdAndDelete(id);

    successResponse(res, 200, 'Profile deleted successfully', null);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const profile = await InfluencerProfile.findOne({ userId }).populate('userId', 'name email profilePicture');

    if (!profile) {
      return errorResponse(res, 404, 'Profile not found');
    }

    successResponse(res, 200, 'Profile retrieved successfully', { profile });
  } catch (error) {
    next(error);
  }
};






export const filterInfluencers = async (req, res, next) => {
  try {
    const {
      category,
      verified,
      platform,
      minFollowers,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Category filter (supports comma-separated list)
    if (category) {
      const categories = Array.isArray(category)
        ? category
        : category.split(",");
      query.category = { $in: categories };
    }

    // Verified filter
    if (verified !== undefined) {
      query.verified = verified === "true";
    }

    // Followers + platform filter
    if (minFollowers && platform) {
      query[`followers.${platform}`] = { $gte: parseInt(minFollowers) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const profiles = await InfluencerProfile.find(query)
      .populate("userId", "name email profilePicture")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await InfluencerProfile.countDocuments(query);

    successResponse(res, 200, "Filtered influencers retrieved successfully", {
      profiles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔹 Search influencers by name, bio, or category
 * Example: /api/influencers/search?query=makeup
 */
export const searchInfluencers = async (req, res, next) => {
  try {
    const { query: searchTerm, page = 1, limit = 12 } = req.query;

    if (!searchTerm || searchTerm.trim() === "") {
      return errorResponse(res, 400, "Search query is required");
    }

    const regex = new RegExp(searchTerm, "i"); // case-insensitive search
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Step 1: Find matching users by name
    const matchingUsers = await User.find({ name: regex }).select("_id");
    const userIds = matchingUsers.map((u) => u._id);

    // Step 2: Find matching influencer profiles
    const query = {
      $or: [
        { bio: regex },
        { category: regex },
        { userId: { $in: userIds } },
      ],
    };

    const profiles = await InfluencerProfile.find(query)
      .populate("userId", "name email profilePicture")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await InfluencerProfile.countDocuments(query);

    successResponse(res, 200, "Search results retrieved successfully", {
      profiles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};