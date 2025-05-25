import { BASE_BACKEND_URL, SERVER_ERROR } from '@/Constants/constants';
const getResponse = async (userInput) => {
    try {
        const res = await fetch(`${BASE_BACKEND_URL}/bot/quick-bot`, {
            method: 'POST',
            // credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput }),
        });

        const data = await res.json();

        if (res.status === SERVER_ERROR) {
            throw new Error(data.message);
        }
        return data;
    } catch (err) {
        console.error('error in bot service', err);
        throw err;
    }
};

export { getResponse };
