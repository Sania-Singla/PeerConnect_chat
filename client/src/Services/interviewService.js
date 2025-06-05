import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class InterviewService {
    async getFeedback(messages) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/interviews/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: messages }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in feedback service', err);
            throw err;
        }
    }
}

export const interviewService = new InterviewService();
