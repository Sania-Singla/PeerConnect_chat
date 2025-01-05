import { ChatHeader, ChatInput, ChatSidebar } from '../..';
import { Outlet } from 'react-router-dom';
import { useChatContext } from '../../../Context';

export default function ChatLayout() {
    const { selectedChat } = useChatContext();
    
    return (
        <div className="fixed top-[60px] inset-0 flex">
            <ChatSidebar />
            <div className="flex flex-col flex-1">
                {selectedChat && <ChatHeader />}
                <Outlet />
                {selectedChat && <ChatInput />}
            </div>
        </div>
    );
}
