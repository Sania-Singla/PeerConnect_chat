import { useContext, createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './UserContext';
import { useChatContext } from './ChatContext';

const SocketContext = createContext();

const SocketContextProvider = ({ children, navigate }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useUserContext();
    const { setChats, setChatStatus, setSelectedChat } = useChatContext();

    function connectSocket() {
        if (!user || socket) return;

        const socketInstance = io(import.meta.env.VITE_BACKEND_BASE_URL, {
            withCredentials: true,
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

        socketInstance.on(
            'userStatusChange',
            ({ userId, completeUser, isOnline }) => {
                console.log('User status change:', userId, isOnline);

                // * console.log('what dowe have', chats, selectedChat); // * can't do it because at the time the socket event listeners are defined they uses state at that time so you'll see value in "prev" but not in "chats" or "selectedChat"

                // for sidebar updations
                setChats((prev) =>
                    prev.map((c) => {
                        if (
                            c.members.find(({ user_id }) => user_id === userId)
                        ) {
                            return {
                                ...c,
                                members: c.members.map((m) => {
                                    if (m.user_id === userId) {
                                        return {
                                            ...m,
                                            isOnline,
                                        };
                                    }
                                    return m;
                                }),
                            };
                        }
                        return c;
                    })
                );

                // although no need to update selectedstate because we have separate state for chatstatus but just to be consistent
                setSelectedChat((prev) => {
                    if (prev) {
                        if (prev.members.some((m) => m.user_id === userId)) {
                            return {
                                ...prev,
                                members: prev.members.map((m) =>
                                    m.user_id === userId
                                        ? { ...m, isOnline }
                                        : m
                                ),
                            };
                        }
                        return prev;
                    }
                });

                // for chat header updations
                setChatStatus((prev) => {
                    if (prev) {
                        const wasOnline = prev.membersOnline.find(
                            (m) => m.user_id === userId
                        );
                        if (wasOnline && !isOnline) {
                            return {
                                ...prev,
                                membersOnline: prev.membersOnline.filter(
                                    ({ user_id }) => user_id !== userId
                                ),
                            };
                        } else if (!wasOnline && isOnline) {
                            return {
                                ...prev,
                                membersOnline: [
                                    ...prev.membersOnline,
                                    { ...completeUser, isOnline },
                                ],
                            };
                        } else {
                            return prev;
                        }
                    }
                });
            }
        );

        socketInstance.on('typing', ({ userId, completeUser, chatId }) => {
            console.log('typing status change:', userId, chatId);

            // for sidebar updations
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return {
                            ...c,
                            members: c.members.map((m) => {
                                if (m.user_id === userId) {
                                    return {
                                        ...m,
                                        isTyping: true,
                                    };
                                }
                                return m;
                            }),
                        };
                    }
                    return c;
                })
            );

            // for chat header updations
            setChatStatus((prev) => {
                const alreadyPresent = prev.membersTyping.find(
                    ({ user_id }) => user_id === userId
                );

                if (!alreadyPresent) {
                    return {
                        ...prev,
                        membersTyping: [
                            ...prev.membersTyping,
                            { ...completeUser, isTyping: true },
                        ],
                    };
                } else {
                    return prev;
                }
            });
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
        user ? connectSocket() : disconnectSocket();
        return () => disconnectSocket();
    }, [user]);

    return (
        <SocketContext.Provider
            value={{ socket, connectSocket, disconnectSocket }}
        >
            {children}
        </SocketContext.Provider>
    );
};

const useSocketContext = () => useContext(SocketContext);

export { useSocketContext, SocketContextProvider };
