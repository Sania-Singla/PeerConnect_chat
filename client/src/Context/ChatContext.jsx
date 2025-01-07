import { useContext, createContext, useState } from 'react';

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineChatIds, setOnlineChatIds] = useState([]);
    const [chats, setChats] = useState([]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                messages,
                onlineChatIds,
                chats,
                setOnlineChatIds,
                setChats,
                setSelectedChat,
                setMessages,
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
