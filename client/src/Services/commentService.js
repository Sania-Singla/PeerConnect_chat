class CommentService {
    async getComments(signal, postId, orderBy = 'desc') {
        try {
            const res = await fetch(
                `/api/v1/comments/post/${postId}?orderBy=${orderBy}`,
                {
                    method: 'GET',
                    signal,
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get comments request aborted.');
            } else {
                console.error(`error in getComments service: ${err.message}`);
                throw err;
            }
        }
    }

    async getComment(signal, commentId) {
        try {
            const res = await fetch(`/api/v1/comments/comment/${commentId}`, {
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
                console.log('get comment request aborted.');
            } else {
                console.error(`error in getComment service: ${err.message}`);
                throw err;
            }
        }
    }

    async addComment(postId, content) {
        try {
            const res = await fetch(`/api/v1/comments/${postId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentContent: content }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in addComment service: ${err.message}`);
            throw err;
        }
    }

    async updateComment(commentId, content) {
        try {
            const res = await fetch(`/api/v1/comments/comment/${commentId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentContent: content }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in updateComment service: ${err.message}`);
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const res = await fetch(`/api/v1/comments/comment/${commentId}`, {
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
            console.error(`error in deleteComment service: ${err.message}`);
            throw err;
        }
    }
}

export const commentService = new CommentService();
