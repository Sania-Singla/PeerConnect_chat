import { useContext, createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from '.';
import { useNavigate } from 'react-router-dom';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useUserContext();
    const navigate = useNavigate();

    function connectSocket() {
        if (!user || socket) return;

        const socketInstance = io(import.meta.env.VITE_BACKEND_BASE_URL, {
            query: {
                userId: user.user_id,
            },
        });

        socketInstance.on('connect', () => {
            console.log('socket connected. SocketId: ', socketInstance.id);
            setSocket(socketInstance);
        });

        // Error Handling
        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            navigate('/server-error');
        });

        socketInstance.on('error', (err) => {
            console.error('Socket error:', err);
            navigate('/server-error');
        });

        return socketInstance; // optional
    }

    function disconnectSocket() {
        if (socket) {
            console.log('socket disconnecting...');
            socket.disconnect(); // will set socket = null implicitly
            setSocket(null);
        }
    }

    useEffect(() => {
        if (user) {
            connectSocket();
        } else {
            disconnectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [user]);

    return (
        <SocketContext.Provider
            value={{
                socket,
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
