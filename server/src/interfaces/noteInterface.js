export class Inotes {
    async getRandomPosts() {
        throw new Error("method getRandomPosts is not overwritten.");
    }

    async getNotes(userId) {
        throw new Error("method getPosts is not overwritten.");
    }

    async getNote(postId) {
        throw new Error("method getPost is not overwritten.");
    }

    async addNote(postId, ownerId, title, content, image) {
        throw new Error("method addPost is not overwritten");
    }

    async deleteNote(postId) {
        throw new Error("method deletePost is not overwritten.");
    }

    async updateNote(postId, title, content, image) {
        throw new Error("method updatePostDetails is not overwritten.");
    }

    async toggleNoteVisibility(NoteId) {
        throw new Error("method togglePostVisibility is not overwritten.");
    }

    async markImportant(NoteId) {
        throw new Error("method togglePostVisibility is not overwritten.");
    }

    async markComplete(NoteId) {
        throw new Error("method togglePostVisibility is not overwritten.");
    }
}
