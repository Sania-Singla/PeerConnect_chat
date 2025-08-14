import { BAD_REQUEST, OK } from '../constants/errorCodes.js';
import { razorpay } from '../config/razorpay.config.js';
import crypto from 'crypto';
import { tryCatch } from '../utils/tryCatch.Util.js';

export const createOrder = tryCatch(
    'create razorpay order',
    async (req, res) => {
        const { amount, currency = 'INR' } = req.body;

        if (!amount) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'amount is required' });
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to the smallest unit (paise for INR)
            currency,
            receipt: `receipt_${new Date().getTime()}`,
        });

        return res.status(OK).json(order);
    }
);

export const verifyPayment = tryCatch('verify payment', async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(BAD_REQUEST).json({ message: 'missing fields' });
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

    if (expectedSignature !== razorpaySignature) {
        return res
            .status(BAD_REQUEST)
            .json({ message: 'Invalid payment signature' });
    }

    return res.status(OK).json({ message: 'Payment verified successfully!' });
});
