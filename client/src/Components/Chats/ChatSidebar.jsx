import { useNavigate, NavLink } from 'react-router-dom';
import { icons } from '../../Assets/icons';
import { useChatContext, useSocketContext } from '../../Context';
import { chatService } from '../../Services';
import { useEffect, useState } from 'react';

export default function ChatSidebar() {
    const { setChats, chats, setChatsLoaded } = useChatContext();
    const { socket } = useSocketContext();
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getChats() {
            try {
                setLoading(true);
                const data = await chatService.getMyChats(signal);

                if (data && !data.message) {
                    socket.emit('onlineUsers', data);

                    socket.on('onlineUsers', (modifiedChats) => {
                        setChats(modifiedChats); // having isOnline Porperty
                        setLoading(false); // work here don't use in finally (async event)
                        setChatsLoaded(true);
                    });
                } else {
                    setChats([]);
                    setLoading(false);
                    setChatsLoaded(true);
                }
            } catch (err) {
                navigate('/server-error');
            }
        })();

        return () => controller.abort();
    }, []);

    const chatElements = chats
        .filter((chat) => {
            if (
                !search.trim() ||
                chat.chat_name.toLowerCase().includes(search.toLowerCase())
            ) {
                return chat;
            }
        })
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
                    to={`chat/${chat_id}`}
                    className={({ isActive }) =>
                        `cursor-pointer flex items-center py-2 px-3 rounded-md transition-all duration-200 
                    hover:backdrop-brightness-95 ${isActive && 'backdrop-brightness-95'} w-full text-left`
                    }
                >
                    {/* Avatar */}
                    {isGroupChat ? (
                        <div className="flex items-center -space-x-9">
                            {avatar.map((url, i) => (
                                <div
                                    key={i}
                                    className="size-[50px] border border-[#434343] rounded-full overflow-hidden"
                                    style={{ zIndex: avatar.length - i }}
                                >
                                    <img
                                        src={url}
                                        alt="avatar"
                                        className="object-cover size-full rounded-full"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="size-[50px] border border-[#434343] rounded-full overflow-hidden">
                                <img
                                    src={avatar}
                                    alt="User Avatar"
                                    className="object-cover w-full h-full rounded-full"
                                />
                            </div>
                            {/* Online Indicator */}

                            {members.find((m) => m.isOnline) && (
                                <span className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                        </div>
                    )}

                    {/* User Info */}
                    <div className="ml-3 w-full">
                        <h4 className="text-[16px] font-semibold text-[#434343] truncate">
                            {chat_name}
                        </h4>
                        {/* Message Preview */}
                        {/*
                        {chat.isTyping ? (
                            <p className="text-xs text-green-500 truncate">typing...</p>
                        ) : (
                            <p className="text-xs text-gray-500 truncate">
                                {lastMessage || 'No messages yet'}
                            </p>
                        )}
                        */}
                    </div>
                </NavLink>
            )
        );

    return (
        <div className="w-[300px] border-r-[0.01rem] border-r-[#e6e6e6] h-full px-3 bg-[#f6f6f6] flex flex-col">
            {/* Search Bar */}
            <div className="relative my-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search or start new chat"
                    className="placeholder:text-[14px] placeholder:text-[#8e8e8e] border border-b-[0.15rem] focus:border-b-[#4977ec] w-full indent-9 pr-3 py-[5px] bg-[#fbfbfb] focus:bg-white rounded-md focus:outline-none"
                />
                <div className="size-[15px] rotate-90 fill-[#bfbdcf9d] absolute left-3 top-[50%] transform translate-y-[-50%]">
                    {icons.search}
                </div>
            </div>

            {/* Chats */}
            <div className="flex-1 overflow-y-scroll flex flex-col gap-[3px]">
                {loading ? ( // TODO: skeleton
                    <div className="text-center">loading ...</div>
                ) : chats.length > 0 ? (
                    chatElements
                ) : (
                    <p className="text-sm text-gray-500 text-center">
                        No Collaborations yet.
                    </p>
                )}
            </div>
        </div>
    );
}
