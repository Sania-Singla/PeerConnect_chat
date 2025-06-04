import { useNavigate, NavLink } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { useChatContext, useUserContext } from '@/Context';
import { chatService } from '@/Services';
import { useEffect, useState } from 'react';
import { formatTime } from '@/Utils';

export default function ChatSidebar() {
    const { setChats, chats, setShowSidebar } = useChatContext();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { user } = useUserContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getChats() {
            try {
                const data = await chatService.getMyChats(signal);
                if (data && !data.message) setChats(data);
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            setChats([]);
            controller.abort();
        };
    }, []);

    const chatElements = chats
        .filter(
            ({ chat_name }) =>
                !search.trim() ||
                chat_name.toLowerCase().includes(search.toLowerCase())
        )
        .map(
            ({
                chat_id,
                chat_name,
                avatar,
                lastMessage,
                isGroupChat,
                members,
            }) => (
                <NavLink
                    key={chat_id}
                    to={chat_id}
                    onClick={() => {
                        setShowSidebar(false);
                    }}
                    className={({ isActive }) =>
                        `cursor-pointer flex align-items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 
                    hover:backdrop-brightness-95 ${isActive && 'backdrop-brightness-95'} w-full text-left`
                    }
                >
                    {/* Avatar */}
                    {isGroupChat ? (
                        <div className="flex items-center -space-x-7">
                            {avatar.map((url, i) => (
                                <div
                                    key={i}
                                    className="size-[40px] border border-[#434343] rounded-full overflow-hidden"
                                    style={{ zIndex: avatar.length - i }}
                                >
                                    <img
                                        loading="lazy"
                                        src={url}
                                        alt="avatar"
                                        className="object-cover size-full rounded-full"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="size-[40px] border border-[#434343] rounded-full overflow-hidden">
                                <img
                                    loading="lazy"
                                    src={avatar}
                                    alt="User Avatar"
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>

                            {/* Online Indicator */}
                            {members.some(
                                (m) => m.isOnline && m.user_id !== user.user_id
                            ) && (
                                <span className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                        </div>
                    )}

                    {/* User Info */}
                    <div className="overflow-hidden flex-1 space-y-[1px]">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-[15px] font-semibold text-gray-900 truncate">
                                {chat_name}
                            </p>
                            {lastMessage.time && (
                                <p className="text-[10px] text-nowrap text-[#515151]">
                                    {formatTime(lastMessage.time)}
                                </p>
                            )}
                        </div>

                        {/* Message Preview */}
                        {members.some((m) => m.isTyping) ? (
                            <p className="text-xs text-green-500">
                                {isGroupChat
                                    ? 'someone is typing...'
                                    : 'typing...'}
                            </p>
                        ) : (
                            <p className="truncate text-xs text-[#414141] ">
                                {lastMessage.message
                                    ? lastMessage.message
                                    : 'No messages yet'}
                            </p>
                        )}
                    </div>
                </NavLink>
            )
        );

    return (
        <div className="w-full border-r-[0.01rem] border-r-[#e6e6e6] h-full px-2 bg-[#f6f6f6] flex flex-col">
            {/* Search Bar */}
            <div className="relative my-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search or start new chat"
                    className="placeholder:text-[14px] font-normal placeholder:text-[#8e8e8e] border-gray-200 border-b-[0.15rem] border-[0.06rem] focus:border-b-[#4977ec] w-full indent-9 pr-3 py-[4px] bg-[#fbfbfb] focus:bg-white rounded-md focus:outline-none"
                />
                <div className="size-[15px] rotate-90 fill-[#bfbdcf9d] absolute left-3 top-[50%] transform translate-y-[-50%]">
                    {icons.search}
                </div>
            </div>

            {/* Chats */}
            <div className="space-y-1 overflow-y-scroll pb-2">
                {loading ? (
                    <div className="text-center">loading ...</div>
                ) : chats.length > 0 ? (
                    chatElements
                ) : (
                    <p className="text-sm text-gray-500 text-center">
                        No Connections yet.
                    </p>
                )}
            </div>
        </div>
    );
}
