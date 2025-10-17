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
