

import mongoose from 'mongoose';

const collaborationRequestSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
collaborationRequestSchema.index({ brandId: 1, status: 1 });
collaborationRequestSchema.index({ influencerId: 1, status: 1 });

const CollaborationRequest = mongoose.model('CollaborationRequest', collaborationRequestSchema);

export default CollaborationRequest;

