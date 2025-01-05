import { useContext, createContext, useState } from 'react';

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [collabUsers, setCollabUsers] = useState([]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                messages,
                onlineUsers,
                collabUsers,
                setCollabUsers,
                setSelectedChat,
                setMessages,
                setOnlineUsers,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const useChatContext = () => {
    return useContext(ChatContext);
};

export { useChatContext, ChatContextProvider };
