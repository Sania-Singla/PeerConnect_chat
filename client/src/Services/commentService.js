import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class CommentService {
    async getComments(signal, postId, orderBy = 'desc') {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/comments/post/${postId}?orderBy=${orderBy}`,
                {
                    method: 'GET',
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
                console.log('get comments request aborted.');
            } else {
                console.error('error in getComments service', err);
                throw err;
            }
        }
    }

    async addComment(postId, content) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/comments/${postId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentContent: content }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in addComment service', err);
            throw err;
        }
    }

    async updateComment(commentId, content) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/comments/comment/${commentId}`,
                {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ commentContent: content }),
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateComment service', err);
            throw err;
        }
    }

    async deleteComment(commentId) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/comments/comment/${commentId}`,
                { method: 'DELETE', credentials: 'include' }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deleteComment service', err);
            throw err;
        }
    }
}

export const commentService = new CommentService();
