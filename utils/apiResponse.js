export const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data })
  });
};

export const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};





// ;

// const seedAdmin = async () => {
//   const hashedPassword = await bcrypt.hash('Admin@123', 10);
//   await User.create({
//     name: 'Admin',
//     email: 'admin@example.com',
//     password: hashedPassword,
//     role: 'admin'
//   });
//   console.log('Admin created successfully!');
//   mongoose.disconnect();
// };

// seedAdmin();



// import User from './models/User.js';
// import bcrypt from 'bcryptjs';

// async function ensureAdminExists() {
//   const adminEmail = 'admin@example.com';
//   const existing = await User.findOne({ email: adminEmail });
//   if (!existing) {
//     const hashed = await bcrypt.hash('Admin@123', 10);
//     await User.create({
//       name: 'Admin',
//       email: adminEmail,
//       password: hashed,
//       role: 'admin'
//     });
//     console.log('✅ Admin account created');
//   }
// }

// ensureAdminExists();





// 🧱 Recommended Structure:
// 1. InfluencerProfile Model (✅ One per user)

// You already have this:

// const influencerProfileSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//   bio: String,
//   category: [String],
//   platformLinks: {
//     instagram: String,
//     youtube: String,
//     tiktok: String
//   },
//   followers: {
//     instagram: Number,
//     youtube: Number,
//     tiktok: Number
//   },
//   verified: { type: Boolean, default: false },
//   rating: { type: Number, default: 0, min: 0, max: 5 },
//   bannerImage: String
// }, { timestamps: true });


// 👉 This defines the influencer's overall presence on your platform.

// 2. Gig Model (✅ Multiple per influencer)
// import mongoose from "mongoose";

// const gigSchema = new mongoose.Schema({
//   influencerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "InfluencerProfile",
//     required: true
//   },
//   title: {
//     type: String,
//     required: true,
//     maxlength: 150
//   },
//   description: {
//     type: String,
//     required: true,
//     maxlength: 2000
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   deliveryTime: {
//     type: Number, // in days
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   thumbnail: {
//     type: String,
//     default: ""
//   },
//   active: {
//     type: Boolean,
//     default: true
//   }
// }, { timestamps: true });

// export default mongoose.model("Gig", gigSchema);


// 👉 Each influencer can have many gigs.
// 👉 You can fetch gigs for a specific influencer easily:

// const gigs = await Gig.find({ influencerId });

// 3. Relation Example

// 👤 User A creates an influencer profile.

// 🛍️ User A creates 5 gigs like:

// “Instagram Story Promotion”

// “Reel Collaboration”

// “Product Review on YouTube”

// etc…

// 4. Why this is better

// It matches Fiverr’s structure.

// Influencer’s profile stays clean and focused on their personal branding.

// Gigs are modular — they can add, update, or delete gigs anytime.

// Easier for brands to filter gigs, not just profiles.

// ✅ Summary:

// One Influencer Profile per user 👤

// Multiple Gigs under each profile 🛍️

// Much cleaner & more scalable than multiple profiles