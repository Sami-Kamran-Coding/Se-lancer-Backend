
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import influencerRoutes from './routes/influencerRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin:'https://se-lancer-mine-frontend.vercel.app' ||  'http://localhost:3000',
  credentials: true
}));

// app.use(cors({
//   origin:'http://localhost:3000',
//   credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Influencer Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/influencer', influencerRoutes);
app.use('/api/collaborations', collaborationRoutes);



// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


export default app;

