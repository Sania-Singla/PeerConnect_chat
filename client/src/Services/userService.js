import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class UserService {
    async getChannelProfile(signal, userId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/users/channel/${userId}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    signal,
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get channel profile request aborted.');
            } else {
                console.error('error in getChannelProfile service', err);
                throw err;
            }
        }
    }

    async updateAccountDetails(inputs) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/account`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateAccountDetails service', err);
            throw err;
        }
    }

    async updateChannelDetails(inputs) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/channel`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateChannelDetails service', err);
            throw err;
        }
    }

    async updateAvatar(avatar) {
        try {
            const formData = new FormData();
            formData.append('avatar', avatar);

            const res = await fetch(`${BASE_BACKEND_URL}/users/avatar`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateAvatar service', err);
            throw err;
        }
    }

    async updateCoverImage(coverImage) {
        try {
            const formData = new FormData();
            formData.append('coverImage', coverImage);

            const res = await fetch(`${BASE_BACKEND_URL}/users/coverImage`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateCoverImage service', err);
            throw err;
        }
    }

    async updatePassword(newPassword, oldPassword) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/password`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newPassword,
                    oldPassword,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updatePassword service', err);
            throw err;
        }
    }

    async getWatchHistory(signal, limit = 10, page = 1, orderBy = 'desc') {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/users/history?orderBy=${orderBy}&limit=${limit}&page=${page}`,
                {
                    method: 'GET',
                    signal,
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get watch history request aborted.');
            } else {
                console.error('error in getWatchHistory service', err);
                throw err;
            }
        }
    }

    async clearWatchHistory() {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/history`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in clearWatchHistory service', err);
            throw err;
        }
    }
}

export const userService = new UserService();
