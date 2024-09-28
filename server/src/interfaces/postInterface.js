export class Iposts {
    async getRandomPosts(limit, orderBy) {
        throw new Error("Method getRandomPosts is not overwritten.");
    }

    async getPosts(userId, limit, orderBy) {
        throw new Error("Method getPosts is not overwritten.");
    }

    async getPost(postId) {
        throw new Error("Method getPost is not overwritten.");
    }

    async createPost(postId, ownerId, title, content, image) {
        throw new Error("Method addPost is not overwritten");
    }

    async deletePost(postId) {
        throw new Error("Method deletePost is not overwritten.");
    }

    async updatePostDetails(postId, title, content, updatedAt) {
        throw new Error("Method updatePostDetails is not overwritten.");
    }

    async updatePostImage(postId, image, updatedAt) {
        throw new Error("Method updatePostImage is not overwritten.");
    }

    async togglePostVisibility(PostId, visibility) {
        throw new Error("Method togglePostVisibility is not overwritten.");
    }

    async toggleSavePost(PostId, userId) {
        throw new Error("Method toggleSavePost is not overwritten.");
    }
}
