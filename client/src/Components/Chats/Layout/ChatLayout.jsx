import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ChatHeader, ChatInput } from '@/Components';
import { useChatContext } from '@/Context';
import { useEffect, useState } from 'react';
import { chatService } from '@/Services';

export default function ChatLayout() {
    const { chatId } = useParams();
    const { setSelectedChat } = useChatContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { pathname } = useLocation();

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
        <div className="h-full w-full">
            <div className="h-[60px] bg-[#f6f6f6]">
                <ChatHeader />
            </div>
            <div
                className={`bg-[#f6f6f6] ${pathname.includes('/details') ? 'h-[calc(100%-60px)]' : 'h-[calc(100%-120px)]'} overflow-y-scroll`}
            >
                <Outlet />
            </div>
            <div
                className={`${pathname.includes('/details') ? 'hidden' : 'block h-[60px]'} bg-[#f6f6f6]`}
            >
                <ChatInput />
            </div>
        </div>
    );
}
