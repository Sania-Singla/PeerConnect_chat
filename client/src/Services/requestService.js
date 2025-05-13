import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class RequestService {
    async sendRequest(userId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/requests/send/${userId}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('error in sendRequest service', err);
            throw err;
        }
    }
    async rejectRequest(requestId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/requests/reject/${requestId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('error in rejectRequest service', err);
            throw err;
        }
    }
    async acceptRequest(requestId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/requests/accept/${requestId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('error in acceptRequest service', err);
            throw err;
        }
    }
    async getMyRequests(signal) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/requests`, {
                signal,
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            if (err.name === 'AbortError') {
                console.log('get my requests request aborted.');
            } else {
                console.error('error in getMyRequests service', err);
                throw err;
            }
        }
    }

    async getRequest(userId, signal) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/requests/${userId}`, {
                signal,
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get request request aborted.');
            } else {
                console.error('error in getRequest service', err);
                throw err;
            }
        }
    }
}

export const requestService = new RequestService();
