import { ChatHeader, ChatInput, ChatSidebar } from '../..';
import { Outlet } from 'react-router-dom';

export default function ChatLayout() {
    return (
        <div className="w-full h-full flex">
            <ChatSidebar />
            <div className="flex flex-col flex-1">
                <ChatHeader />
                <Outlet />
                <ChatInput />
            </div>
        </div>
    );
}
