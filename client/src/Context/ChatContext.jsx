import { useContext, createContext, useState } from 'react';

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [requests, setRequests] = useState([]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                messages,
                chats,
                setChats,
                setSelectedChat,
                setMessages,
                setRequests,
                requests,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const useChatContext = () => useContext(ChatContext);

export { useChatContext, ChatContextProvider };
