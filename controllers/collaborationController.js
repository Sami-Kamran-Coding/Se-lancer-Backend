

import CollaborationRequest from '../models/CollaborationRequest.js';
import InfluencerProfile from '../models/InfluencerProfile.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createCollaborationRequest = async (req, res, next) => {
  try {
    const brandId = req.user._id;
    const { influencerId, message } = req.body;

    // Check if user is a brand
    if (req.user.role !== 'brand') {
      return errorResponse(res, 403, 'Only brands can send collaboration requests');
    }

    // Check if influencer profile exists
    const influencerProfile = await InfluencerProfile.findOne({ userId: influencerId });
    if (!influencerProfile) {
      return errorResponse(res, 404, 'Influencer not found');
    }

    // Check for existing pending request
    const existingRequest = await CollaborationRequest.findOne({
      brandId,
      influencerId,
      status: 'pending'
    });

    if (existingRequest) {
      return errorResponse(res, 400, 'You already have a pending request with this influencer');
    }

    const collaboration = await CollaborationRequest.create({
      brandId,
      influencerId,
      message
    });

    const populatedCollaboration = await CollaborationRequest.findById(collaboration._id)
      .populate('brandId', 'name email profilePicture')
      .populate('influencerId', 'name email profilePicture');

    successResponse(res, 201, 'Collaboration request sent successfully', { collaboration: populatedCollaboration });
  } catch (error) {
    next(error);
  }
};

export const getMyCollaborations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const query = {};

    if (req.user.role === 'brand') {
      query.brandId = userId;
    } else if (req.user.role === 'influencer') {
      query.influencerId = userId;
    } else {
      return errorResponse(res, 403, 'Invalid user role');
    }

    if (status) {
      query.status = status;
    }

    const collaborations = await CollaborationRequest.find(query)
      .populate('brandId', 'name email profilePicture')
      .populate('influencerId', 'name email profilePicture')
      .sort({ createdAt: -1 });

    successResponse(res, 200, 'Collaborations retrieved successfully', { collaborations });
  } catch (error) {
    next(error);
  }
};

export const updateCollaborationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!['accepted', 'declined'].includes(status)) {
      return errorResponse(res, 400, 'Invalid status. Use "accepted" or "declined"');
    }

    const collaboration = await CollaborationRequest.findById(id);

    if (!collaboration) {
      return errorResponse(res, 404, 'Collaboration request not found');
    }

    // Only influencer can update status
    if (collaboration.influencerId.toString() !== userId.toString()) {
      return errorResponse(res, 403, 'Not authorized to update this request');
    }

    if (collaboration.status !== 'pending') {
      return errorResponse(res, 400, 'This request has already been responded to');
    }

    collaboration.status = status;
    await collaboration.save();

    const updatedCollaboration = await CollaborationRequest.findById(id)
      .populate('brandId', 'name email profilePicture')
      .populate('influencerId', 'name email profilePicture');

    successResponse(res, 200, `Collaboration request ${status}`, { collaboration: updatedCollaboration });
  } catch (error) {
    next(error);
  }
};



