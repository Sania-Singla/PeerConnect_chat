import { useContext, createContext, useState } from 'react';

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]); // can use [] instead of null
    const [chats, setChats] = useState(null); // don't use []

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                messages,
                chats,
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
