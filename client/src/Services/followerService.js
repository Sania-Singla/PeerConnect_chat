class FollowerService {
    async getFollowers(channelId) {
        try {
            const res = await fetch(`/api/v1/followers/${channelId}`, {
                method: 'GET',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in getFollowers service: ${err.message}`);
            throw err;
        }
    }

    async getFollowings(channelId) {
        try {
            const res = await fetch(`/api/v1/followers/follows/${channelId}`, {
                method: 'GET',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in getFollowings service: ${err.message}`);
            throw err;
        }
    }

    async toggleFollow(channelId) {
        try {
            const res = await fetch(`/api/v1/followers/toggle/${channelId}`, {
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
