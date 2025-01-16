import { useParams, useNavigate } from 'react-router-dom';
import { Chat, ChatHeader, ChatInput } from '..';
import { useChatContext } from '../../Context';
import { useEffect, useState } from 'react';

export default function ChatLayout() {
    const { chatId } = useParams();
    const { setSelectedChat, setChatStatus, chats, chatsLoaded } =
        useChatContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        if (chatsLoaded) {
            const chat = chats.find(({ chat_id }) => chat_id === chatId);
            if (chat) {
                setSelectedChat(chat);
                setChatStatus({
                    membersOnline: chat.members.filter((m) => m.isOnline),
                    membersTyping: chat.members.filter((m) => m.isTyping),
                });
            } else {
                setSelectedChat(null);
                navigate('/not-found');
            }
            setLoading(false);
        }

        return () => {
            setSelectedChat(null);
            setChatStatus(null);
        };
    }, [chatId, chatsLoaded]);

    if (loading) {
        // TODO: skeleton
        return <div>loading...</div>;
    }

    return (
        <div className="flex flex-col h-full w-[calc(100vw-300px)]">
            <div className="bg-[#f6f6f6] h-[60px]">
                <ChatHeader />
            </div>
            <div className="bg-[#f6f6f6] h-[calc(100%-180px)] overflow-y-scroll p-6">
                <Chat />
            </div>
            <div className="h-[60px] bg-[#f6f6f6]">
                <ChatInput />
            </div>
        </div>
    );
}
