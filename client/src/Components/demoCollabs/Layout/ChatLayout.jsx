import { ChatSidebar } from '../..';
import { Outlet } from 'react-router-dom';
import { icons } from '../../../Assets/icons';
import { useSocketContext } from '../../../Context';

export default function ChatLayout() {
    const { socket } = useSocketContext();

    return (
        <div className="fixed z-[100] inset-0">
            {socket ? (
                <div className="w-full h-full flex">
                    <div className="w-[280px]">
                        <ChatSidebar />
                    </div>
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#f6f6f6]">
                    <div className="size-[33px] fill-[#4977ec] dark:text-[#ececec]">
                        {icons.loading}
                    </div>
                </div>
            )}
        </div>
    );
}
