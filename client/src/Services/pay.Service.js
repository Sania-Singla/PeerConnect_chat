import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class PayService {
    async createOrder({ amount, currency = 'INR' }) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/payments/create-order`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount,
                        currency,
                    }),
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in createOrder service', err);
            throw err;
        }
    }

    async verifyPayment({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
    }) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/payments/verify-payment`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpayOrderId,
                        razorpayPaymentId,
                        razorpaySignature,
                    }),
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in verifyPayment service', err);
            throw err;
        }
    }
}

export const payService = new PayService();
