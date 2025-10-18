

import express from 'express';
import { body } from 'express-validator';
import {
  createInfluencerProfile,
  getInfluencerProfile,
  getAllInfluencers,
  updateInfluencerProfile,
  deleteInfluencerProfile,
  getMyProfile,
  filterInfluencers,
  searchInfluencers
} from '../controllers/influencerController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/', getAllInfluencers);
router.get('/me', protect, restrictTo('influencer'), getMyProfile);

router.post(
  '/',
  protect,
  restrictTo('influencer'),
  [
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
    body('category').optional().isArray().withMessage('Category must be an array'),
    validateRequest
  ],
  createInfluencerProfile
);

router.get('/filter', filterInfluencers); 
router.get('/search', searchInfluencers);

router.get('/:id', getInfluencerProfile);

router.put('/:id', protect, restrictTo('influencer'), updateInfluencerProfile);
router.delete('/:id', protect, restrictTo('influencer'), deleteInfluencerProfile);

export default router;


