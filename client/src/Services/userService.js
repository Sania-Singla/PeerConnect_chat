class UserService {
    async getChannelProfile(username) {
        try {
            const res = await fetch(`/api/v1/users/channel/${username}`, {
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
            console.error(`error in getChannelProfile service: ${err.message}`);
            throw err;
        }
    }

    async updateAccountDetails(inputs) {
        try {
            const res = await fetch('/api/v1/users/account', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(
                `error in updateAccountDetails service: ${err.message}`
            );
            throw err;
        }
    }

    async updateChannelDetails(inputs) {
        try {
            const res = await fetch('/api/v1/users/channel', {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(
                `error in updateChannelDetails service: ${err.message}`
            );
            throw err;
        }
    }

    async updateAvatar(avatar) {
        try {
            const formData = new FormData();
            formData.append('avatar', avatar);

            const res = await fetch('/api/v1/users/avatar', {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in updateAvatar service: ${err.message}`);
            throw err;
        }
    }

    async updateCoverImage(coverImage) {
        try {
            const formData = new FormData();
            formData.append('coverImage', coverImage);

            const res = await fetch('/api/v1/users/coverImage', {
                method: 'PATCH',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in updateCoverImage service: ${err.message}`);
            throw err;
        }
    }

    async updatePassword(newPassword, oldPassword) {
        try {
            const res = await fetch('/api/v1/users/password', {
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

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in updatePassword service: ${err.message}`);
            throw err;
        }
    }

    async getWatchHistory(limit = 10, page = 1, orderBy = 'desc') {
        try {
            const res = await fetch(
                `/api/v1/users/history?orderBy=${orderBy}&limit=${limit}&page=${page}`,
                {
                    method: 'GET',
                    credentials: 'include',
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in getWatchHistory service: ${err.message}`);
            throw err;
        }
    }

    async clearWatchHistory() {
        try {
            const res = await fetch('/api/v1/users/history', {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in clearWatchHistory service: ${err.message}`);
            throw err;
        }
    }
}

export const userService = new UserService();
