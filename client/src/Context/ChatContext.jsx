import { useContext, createContext, useState } from 'react';

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [chatsLoaded, setChatsLoaded] = useState(false);
    const [chatStatus, setChatStatus] = useState(null); // for online & typing members tracking

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                messages,
                chats,
                chatsLoaded,
                chatStatus,
                setChatStatus,
                setChatsLoaded,
                setChats,
                setSelectedChat,
                setMessages,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const useChatContext = () => useContext(ChatContext);

export { useChatContext, ChatContextProvider };
