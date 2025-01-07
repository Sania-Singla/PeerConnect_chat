class ChatService {
    async getChats(signal) {
        try {
            const res = await fetch(`/api/chats`, {
                method: 'GET',
                credentials: 'include',
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
                console.log('get chats request aborted.');
            } else {
                console.error(`error in getChats service: ${err}`);
                throw err;
            }
        }
    }
}

export const chatService = new ChatService();
