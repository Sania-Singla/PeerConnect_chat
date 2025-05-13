import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class FollowerService {
    async getFollowers(signal, channelId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/followers/${channelId}`,
                { method: 'GET', signal }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get followers request aborted.');
            } else {
                console.error('error in getFollowers service', err);
                throw err;
            }
        }
    }

    async getFollowings(signal, channelId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/followers/follows/${channelId}`,
                { method: 'GET', signal }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get followings request aborted.');
            } else {
                console.error('error in getFollowings service', err);
                throw err;
            }
        }
    }

    async toggleFollow(channelId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/followers/toggle/${channelId}`,
                { method: 'POST', credentials: 'include' }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in toggleFollow service', err);
            throw err;
        }
    }
}

export const followerService = new FollowerService();
