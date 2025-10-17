
import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['post', 'story', 'review', 'video', 'reel']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const influencerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  category: {
    type: [String],
    default: []
  },
  platformLinks: {
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    tiktok: { type: String, default: '' }
  },
  followers: {
    instagram: { type: Number, default: 0 },
    youtube: { type: Number, default: 0 },
    tiktok: { type: Number, default: 0 }
  },
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  pricing: {
    type: [pricingSchema],
    default: []
  },
  bannerImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for searching
influencerProfileSchema.index({ category: 1 });
influencerProfileSchema.index({ verified: 1 });
influencerProfileSchema.index({ 'followers.instagram': 1 });
influencerProfileSchema.index({ 'followers.youtube': 1 });

const InfluencerProfile = mongoose.model('InfluencerProfile', influencerProfileSchema);

export default InfluencerProfile;

