import { useUserContext } from '@/Context';
import { payService } from '@/Services';

export default function PaymentPage() {
    const { user } = useUserContext();

    async function loadRazorpayScript() {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    async function handleClick() {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            alert('Razorpay SDK failed to load. Check your internet.');
            return;
        }

        const order = await payService.createOrder({
            amount: 1,
            currency: 'INR',
        });

        new window.Razorpay({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Demo Payment',
            description: 'Demo Payment testing',
            order_id: order.id,
            prefill: { name: user.user_fullName, email: user.user_email },
            theme: { color: '#f68533' },
            handler: async (response) => {
                console.log('Payment response:', response);
                await payService.verifyPayment({
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                });
            },
        }).open();
    }

    return (
        <div>
            <h1>Payment Page</h1>
            <button onClick={handleClick}>Pay</button>
        </div>
    );
}
