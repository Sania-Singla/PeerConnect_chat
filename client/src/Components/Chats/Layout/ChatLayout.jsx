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
        <div className="flex flex-col h-full w-full bg-[#f6f6f6]">
            <div className="h-[60px]">
                <ChatHeader />
            </div>

            <Outlet />

            {/* Input bar only if not in chat details */}
            {!pathname.includes('/details') && (
                <div>
                    <div className="bg-[#f6f6f6] h-[60px]">
                        <ChatInput />
                    </div>
                </div>
            )}
        </div>
    );
}
