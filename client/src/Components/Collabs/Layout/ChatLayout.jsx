import { ChatSidebar } from '../..';
import { Outlet } from 'react-router-dom';

export default function ChatLayout() {
    return (
        <div className="fixed z-[100] inset-0 flex">
            <ChatSidebar />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}
