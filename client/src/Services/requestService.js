class RequestService {
    async sendRequest(userId) {
        try {
            const res = await fetch(`/api/requests/send/${userId}`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
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
            const res = await fetch(`/api/requests/reject/${requestId}`, {
                method: 'PATCH',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
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
            const res = await fetch(`/api/requests/accept/${requestId}`, {
                method: 'PATCH',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
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
            const res = await fetch(`/api/requests`, {
                signal,
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
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
            const res = await fetch(`/api/requests/${userId}`, {
                signal,
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
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
