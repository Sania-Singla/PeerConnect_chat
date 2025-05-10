import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { ChatHeader, ChatInput } from '../..';
import { useChatContext } from '../../../Context';
import { useEffect, useState } from 'react';
import { chatService } from '../../../Services';

export default function ChatLayout() {
    const { chatId } = useParams();
    const { setSelectedChat } = useChatContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        setLoading(true);

        (async function getChat() {
            try {
                const chat = await chatService.getChatDetails(signal, chatId);
                if (chat && !chat.message) {
                    setSelectedChat((prev) => ({
                        ...prev,
                        chat,
                        membersTyping: [],
                        membersOnline: chat.members.filter((m) => m.isOnline),
                    }));
                } else navigate('/not-found');
            } catch (err) {
                console.log(err);
                navigate('/server-error');
            } finally {
                setLoading(false);
            }

            return () => {
                setSelectedChat(null);
                controller.abort();
            };
        })();
    }, [chatId]);

    if (loading) return <div>loading...</div>;

    return (
        <div className="flex flex-col h-full w-[calc(100vw-300px)]">
            <div className="h-[60px] bg-[#f6f6f6]">
                <ChatHeader />
            </div>
            <div className="bg-[#f6f6f6] h-[calc(100%-180px)] overflow-y-scroll">
                <Outlet />
            </div>
            <div className="h-[60px] bg-[#f6f6f6]">
                <ChatInput />
            </div>
        </div>
    );
}
