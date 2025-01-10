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

    async getChat(signal, chatId) {
        try {
            const res = await fetch(`/api/chats/${chatId}`, {
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
                console.log('get chat request aborted.');
            } else {
                console.error(`error in getChat service: ${err}`);
                throw err;
            }
        }
    }

    async getMessages(signal, chatId, page, limit) {
        try {
            const res = await fetch(`/api/messages/${chatId}?page=${page}`, {
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
                console.log('get messages request aborted.');
            } else {
                console.error(`error in getMessages service: ${err}`);
                throw err;
            }
        }
    }

    async sendMessage(chatId, message) {
        try {
            let body, headers;
            if (message.attachment) {
                const formData = new FormData();
                formData.append('attachment', message.attachment);
                formData.append('text', message.text);
                body = formData;
            } else {
                body = JSON.stringify({ text: message.text });
                headers = { 'Content-Type': 'application/json' };
            }

            const res = await fetch(`/api/messages/${chatId}`, {
                method: 'POST',
                credentials: 'include',
                headers,
                body,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error(`error in sendMessage service: ${err}`);
            throw err;
        }
    }
}

export const chatService = new ChatService();
