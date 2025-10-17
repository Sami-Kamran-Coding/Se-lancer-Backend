
import express from 'express';
import { body } from 'express-validator';
import {
  createCollaborationRequest,
  getMyCollaborations,
  updateCollaborationStatus
} from '../controllers/collaborationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('influencerId').notEmpty().withMessage('Influencer ID is required'),
    body('message').notEmpty().withMessage('Message is required').isLength({ max: 1000 }).withMessage('Message must be less than 1000 characters'),
    validateRequest
  ],
  createCollaborationRequest
);

router.get('/', protect, getMyCollaborations);

router.put(
  '/:id',
  protect,
  [
    body('status').isIn(['accepted', 'declined']).withMessage('Status must be either "accepted" or "declined"'),
    validateRequest
  ],
  updateCollaborationStatus
);

export default router;


