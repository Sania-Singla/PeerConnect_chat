import { useContext, createContext, useState } from 'react';
import { io } from 'socket.io-client';
import { useChatContext } from './ChatContext';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const { user } = useUserContext();
    const { setChats, setMessages } = useChatContext();
    const navigate = useNavigate();
    let isConnecting = false;

    function connectSocket() {
        isConnecting = true;
        if (!user || socket) return;

        const socketInstance = io(import.meta.env.VITE_BACKEND_BASE_URL, {
            query: {
                userId: user?.user_id,
            },
        });

        socketInstance.on('connect', () => {
            console.log('socket connected...', socketInstance.id);
            isConnecting = false;
            setSocket(socketInstance);
            setIsSocketConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('socket disconnected...');
            setSocket(null);
            setIsSocketConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            navigate('/server-error');
        });

        socketInstance.on('disconnect_error', (err) => {
            console.error('Socket disconnect error:', err);
            navigate('/server-error');
        });

        // Handle any generic socket errors
        socketInstance.on('error', (err) => {
            console.error('Socket error:', err);
            navigate('/server-error');
        });

        socketInstance.on('chats', (data) => {
            const { onlineChatIds, allChats } = data;

            console.log('chats', allChats);

            const onlineChatSet = new Set(onlineChatIds);

            const updatedChats = allChats.map((chat) => ({
                ...chat,
                isOnline: onlineChatSet.has(chat.chat_id),
            }));

            setChats(updatedChats);
        });

        socketInstance.on('chatStatusChange', ({ chatId, isOnline }) => {
            console.log('status changed', isOnline);

            setChats((prev) =>
                prev?.map((chat) => {
                    if (chat.chat_id === chatId)
                        return {
                            ...chat,
                            isOnline,
                        };
                    else return chat;
                })
            );
        });

        socketInstance.on('newMessage', (message) => {
            console.log('new message');

            // update last message
            setChats((prev) =>
                prev.map((chat) => {
                    if (chat.chat_id === message.chat_id) {
                        return {
                            ...chat,
                            lastMessage: message.text || message.fileName,
                        };
                    } else {
                        return chat;
                    }
                })
            );

            // append message
            setMessages((prev) => (prev ? [...prev, message] : [message]));
        });

        socketInstance.on('typing', (chatId) => {
            console.log("typing");
            
            setChats((prev) =>
                prev?.map((chat) => {
                    if (chat.chat_id === chatId) {
                        return {
                            ...chat,
                            isTyping: true,
                        };
                    } else return chat;
                })
            );
        });

        socketInstance.on('stoppedTyping', (chatId) => {
            console.log("stopped typing");

            setChats((prev) =>
                prev?.map((chat) => {
                    if (chat.chat_id === chatId) {
                        return {
                            ...chat,
                            isTyping: false,
                        };
                    } else return chat;
                })
            );
        });

        // Finally, establish the connection
        socketInstance.connect();
    }

    function disconnectSocket() {
        if (socket) {
            socket.disconnect(); // will set socket = null implicitly
        }
    }

    return (
        <SocketContext.Provider
            value={{
                socket,
                isSocketConnected,
                setIsSocketConnected,
                setSocket,
                connectSocket,
                disconnectSocket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

const useSocketContext = () => {
    return useContext(SocketContext);
};

export { useSocketContext, SocketContextProvider };
