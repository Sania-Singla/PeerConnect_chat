import { useUserContext, useSocketContext } from '../Context';
import { ChatNavbar, ChatSidebar } from '../Components';
import { Outlet } from 'react-router-dom';

export default function ChatsPage() {
    const { user } = useUserContext();
    const { socket } = useSocketContext();

    if (!user) return <div>Login to Collaborate with others</div>;

    if (!socket) return <div>loading...</div>;

    return (
        <div className="fixed z-[100] inset-0 bg-white">
            <ChatNavbar />
            <div className="flex h-full w-full">
                <div className="w-[300px] h-[calc(100%-60px)]">
                    <ChatSidebar />
                </div>
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
