import { sendOTP, verifyOTP } from '../controllers/authController';
import express, { Request, Response } from 'express';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOTP);

// Route to verify OTP and register/login user
router.post('/verify-otp', verifyOTP);

export default router;
