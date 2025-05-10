import { useContext, createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUserContext } from './UserContext';
import { useChatContext } from './ChatContext';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useUserContext();
    const { setChats, setSelectedChat, setMessages, setRequests } =
        useChatContext();

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
        });

        socketInstance.on('error', (err) => {
            console.error('Socket error:', err);
        });

        socketInstance.on(
            'userStatusChange',
            ({ userId, targetUser, isOnline }) => {
                // for sidebar updations
                setChats((prev) =>
                    prev.map((c) => ({
                        ...c,
                        members: c.members.map((m) => {
                            if (m.user_id === userId) {
                                return { ...m, isOnline, isTyping: false };
                            } else return m;
                        }),
                    }))
                );

                // for chat header updations
                setSelectedChat((prev) => {
                    if (prev) {
                        const wasOnline = prev?.membersOnline.find(
                            (m) => m.user_id === userId
                        );
                        if (wasOnline && !isOnline) {
                            return {
                                ...prev,
                                membersTyping: prev?.membersTyping.filter(
                                    ({ user_id }) => user_id !== userId
                                ),
                                membersOnline: prev?.membersOnline.filter(
                                    ({ user_id }) => user_id !== userId
                                ),
                            };
                        } else if (!wasOnline && isOnline) {
                            return {
                                ...prev,
                                membersOnline:
                                    prev?.membersOnline.concat(targetUser),
                            };
                        } else return prev;
                    }
                });
            }
        );

        socketInstance.on('typing', ({ targetUser, chatId }) => {
            // for sidebar updations
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return {
                            ...c,
                            members: c.members.map((m) => {
                                if (m.user_id === targetUser.user_id) {
                                    return { ...m, isTyping: true };
                                } else return m;
                            }),
                        };
                    } else return c;
                })
            );

            // for chat header updations
            setSelectedChat((prev) => {
                const alreadyPresent = prev?.membersTyping.find(
                    ({ user_id }) => user_id === targetUser.user_id
                );

                if (!alreadyPresent) {
                    return {
                        ...prev,
                        membersTyping: prev?.membersTyping.concat(targetUser),
                    };
                } else return prev;
            });
        });

        socketInstance.on('stoppedTyping', ({ chatId, targetUser }) => {
            // for sidebar updations
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return {
                            ...c,
                            members: c.members.map((m) => {
                                if (m.user_id === targetUser.user_id) {
                                    return { ...m, isTyping: false };
                                } else return m;
                            }),
                        };
                    } else return c;
                })
            );

            // for chat header updations
            setSelectedChat((prev) => {
                return {
                    ...prev,
                    membersTyping: prev.membersTyping.filter(
                        ({ user_id }) => user_id !== targetUser.user_id
                    ),
                };
            });
        });

        socketInstance.on('requestAccepted', (chat) => {
            setChats((prev) => prev.concat(chat));
        });

        socketInstance.on('newChat', (chat) => {
            setChats((prev) =>
                prev.concat({
                    ...chat,
                    avatar: chat.isGroupChat
                        ? chat.members
                              .slice(0, 3)
                              .map(({ user_avatar }) => user_avatar)
                        : chat.avatar,
                })
            );
        });

        socketInstance.on('newRequest', (request) => {
            setRequests((prev) => prev.concat(request));
        });

        socketInstance.on('newMessage', ({ chatId, message }) => {
            setMessages((prev) => prev.concat(message));

            // update chat's last message
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return {
                            ...c,
                            lastMessage: {
                                message:
                                    message.text ||
                                    message.attachments.slice(-1)[0]?.name,
                                time: message.message_createdAt,
                            },
                        };
                    } else return c;
                })
            );
        });

        socketInstance.on('memberRemoved', ({ chatId, userId }) => {
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return {
                            ...c,
                            avatar: c.members
                                .filter(({ user_id }) => user_id !== userId)
                                .slice(0, 3)
                                .map(({ user_avatar }) => user_avatar),
                            members: c.members.filter(
                                ({ user_id }) => user_id !== userId
                            ),
                        };
                    } else return c;
                })
            );

            // update selected chat
            setSelectedChat((prev) => {
                if (prev?.chat.chat_id === chatId) {
                    return {
                        membersTyping: prev.membersTyping.filter(
                            ({ user_id }) => user_id !== userId
                        ),
                        membersOnline: prev.membersOnline.filter(
                            ({ user_id }) => user_id !== userId
                        ),
                        chat: {
                            ...prev.chat,
                            members: prev.chat.members.filter(
                                ({ user_id }) => user_id !== userId
                            ),
                        },
                    };
                } else return prev;
            });
        });

        socketInstance.on('membersAdded', ({ chatId, members }) => {
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return {
                            ...c,
                            avatar: members
                                .slice(0, 3)
                                .map(({ user_avatar }) => user_avatar),
                            members,
                        };
                    } else return c;
                })
            );

            // update selected chat
            setSelectedChat((prev) => {
                if (prev?.chat.chat_id === chatId) {
                    return { ...prev, chat: { ...prev.chat, members } };
                } else return prev;
            });
        });

        socketInstance.on('memberPromoted', ({ chatId, userId }) => {
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return {
                            ...c,
                            members: c.members.map((m) => {
                                if (m.user_id === userId) {
                                    return { ...m, role: 'admin' };
                                } else return m;
                            }),
                        };
                    } else return c;
                })
            );

            setSelectedChat((prev) => {
                if (prev?.chat.chat_id === chatId) {
                    return {
                        ...prev,
                        chat: {
                            ...prev.chat,
                            members: prev.chat.members.map((m) => {
                                if (m.user_id === userId) {
                                    return { ...m, role: 'admin' };
                                } else return m;
                            }),
                        },
                    };
                } else return prev;
            });
        });

        socketInstance.on('groupRenamed', ({ chatId, newName }) => {
            setChats((prev) =>
                prev.map((c) => {
                    if (c.chat_id === chatId) {
                        return { ...c, chat_name: newName };
                    } else return c;
                })
            );

            setSelectedChat((prev) => {
                if (prev?.chat.chat_id === chatId) {
                    return {
                        ...prev,
                        chat: { ...prev.chat, chat_name: newName },
                    };
                } else return prev;
            });
        });

        socketInstance.on('chatDeleted', (chatId) => {
            setChats((prev) =>
                prev.filter(({ chat_id }) => chat_id !== chatId)
            );
        });

        socketInstance.on('editMessage', (message) => {});

        socketInstance.on('deleteMessage', (message) => {});

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
