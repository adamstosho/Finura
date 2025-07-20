import express from 'express';
import { registerUser, loginUser, updateAccountSettings } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/settings', protect, updateAccountSettings);

export default router; 