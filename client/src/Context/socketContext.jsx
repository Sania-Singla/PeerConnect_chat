import { useContext, createContext, useState } from 'react';
import { io } from 'socket.io-client';
import { useChatContext } from './ChatContext';
import { useUserContext } from './UserContext';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useUserContext();
    const { setOnlineChatIds, setChats } = useChatContext();

    function connectSocket() {
        if (!user) return;

        const socket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
            query: {
                userId: user?.user_id,
            },
        });

        socket.connect();

        setSocket(socket);

        socket.on('onlineChats', async ({ onlineChatIds, allChats }) => {
            console.log('online participants listener', onlineChatIds);

            await setChats(allChats);
            await setOnlineChatIds(onlineChatIds);

            socket.emit('notify', allChats);
        });

        socket.on('chatStatusChange', ({ chatId, isOnline }) => {
            setOnlineChatIds((prev) => {
                const updatedSet = new Set(prev);

                if (isOnline) {
                    updatedSet.add(chatId); // Add to the set if the user is online
                } else {
                    updatedSet.delete(chatId); // Remove from the set if the user is offline
                }

                return Array.from(updatedSet); // Convert the set back to an array
            });
        });
    }

    function disconnectSocket() {
        if (socket?.connected) {
            socket.disconnect();
            setSocket(null);
        }
    }

    return (
        <SocketContext.Provider
            value={{
                socket,
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
