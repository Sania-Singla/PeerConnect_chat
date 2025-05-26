import { useSocketContext, useChatContext } from '@/Context';
import { ChatNavbar, ChatSidebar, SmallSidebar } from '@/Components';
import { Outlet, useParams } from 'react-router-dom';

export default function ChatsPage() {
    const { socket } = useSocketContext();
    const { chatId } = useParams();
    const { showSidebar } = useChatContext();

    if (!socket) return <div>loading...</div>;

    return (
        <div className="fixed z-[100] h-screen inset-0 bg-white">
            <ChatNavbar />
            <div className="flex h-full w-full pt-[55px]">
                <div
                    className={`${chatId && !showSidebar ? 'hidden sm:block sm:w-[300px]' : 'w-full sm:w-[300px]'} h-full`}
                >
                    <ChatSidebar />
                </div>
                <SmallSidebar />

                <div
                    className={`${chatId && !showSidebar ? 'flex-1 w-full' : 'hidden sm:block sm:flex-1'} h-full`}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
