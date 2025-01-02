class FollowerService {
    async getFollowers(signal, channelId) {
        try {
            const res = await fetch(`/api/followers/${channelId}`, {
                method: 'GET',
                signal,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get followers request aborted.');
            } else {
                console.error(`error in getFollowers service: ${err.message}`);
                throw err;
            }
        }
    }

    async getFollowings(signal, channelId) {
        try {
            const res = await fetch(`/api/followers/follows/${channelId}`, {
                method: 'GET',
                signal,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get followings request aborted.');
            } else {
                console.error(`error in getFollowings service: ${err.message}`);
                throw err;
            }
        }
    }

    async toggleFollow(channelId) {
        try {
            const res = await fetch(`/api/followers/toggle/${channelId}`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in toggleFollow service: ${err.message}`);
            throw err;
        }
    }
}

export const followerService = new FollowerService();
