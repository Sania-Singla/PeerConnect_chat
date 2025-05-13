import { useSocketContext, useChatContext } from '@/Context';
import { ChatNavbar, ChatSidebar } from '@/Components';
import { Outlet, useParams } from 'react-router-dom';

export default function ChatsPage() {
    const { socket } = useSocketContext();
    const { chatId } = useParams();
    const { showSidebar } = useChatContext();

    if (!socket) return <div>loading...</div>;

    return (
        <div className="fixed z-[100] inset-0 bg-white">
            <ChatNavbar />
            <div className="flex h-full w-full">
                <div
                    className={`${chatId && !showSidebar ? 'hidden sm:block sm:w-[300px]' : 'w-full sm:w-[300px]'} h-[calc(100%-60px)]`}
                >
                    <ChatSidebar />
                </div>
                <div
                    className={`${chatId && !showSidebar ? 'flex-1 w-full' : 'hidden sm:block sm:flex-1'}`}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
