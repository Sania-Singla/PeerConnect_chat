import { Router } from 'express';
import {
    createOrder,
    verifyPayment,
} from '../controllers/razorpay.controller.js';

export const razorpayRouter = Router();

razorpayRouter.post('/create-order', createOrder);
razorpayRouter.post('/verify-payment', verifyPayment);
