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

    async getMessages(signal, chatId) {
        try {
            const res = await fetch(`/api/messages/${chatId}`, {
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

    async sendMessage(signal, chatId, input) {
        try {
            let body;
            if (input.attachment) {
                const formData = new FormData();
                formData.append('attachment', input.attachment);
                formData.append('text', input.text);
                body = formData;
            } else {
                body = JSON.stringify({ text: input.text });
            }

            const res = await fetch(`/api/messages/${chatId}`, {
                method: 'POST',
                credentials: 'include',
                signal,
                body,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 500) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('send message request aborted.');
            } else {
                console.error(`error in sendMessage service: ${err}`);
                throw err;
            }
        }
    }
}

export const chatService = new ChatService();
