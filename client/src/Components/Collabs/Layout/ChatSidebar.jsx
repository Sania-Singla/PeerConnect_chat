import { useNavigate, Link } from 'react-router-dom';
import { icons } from '../../../Assets/icons';
import { useChatContext, useSideBarContext } from '../../../Context';
import { Button } from '../../';
import { LOGO } from '../../../Constants/constants';
import { useEffect, useState } from 'react';

export default function ChatSidebar() {
    const { setSelectedChat, onlineChatIds, chats, setChats } =
        useChatContext();
    const { setShowSideBar } = useSideBarContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            setLoading(true);
            const onlineChatIdsSet = new Set(onlineChatIds);
            setChats((prev) =>
                prev.map((chat) => ({
                    ...chat,
                    isOnline: onlineChatIdsSet.has(chat.chat_id),
                }))
            );
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }, [onlineChatIds]);

    const chatElements = chats.map((chat) => (
        <Button
            key={chat.chat_id}
            onClick={() => {
                setSelectedChat(chat);
                navigate('chat/456');
            }}
            className="flex items-center hover:bg-gray-100 focus:outline-none w-full text-left"
            btnText={
                <div>
                    <div className="relative">
                        {/* Avatar */}
                        {chat.user_avatar ? (
                            <img
                                src={chat.user_avatar}
                                alt="User Avatar"
                                className="w-12 h-12 rounded-full border border-gray-200"
                            />
                        ) : (
                            <div className="size-12 fill-gray-300 drop-shadow-md">
                                {icons.circleUser}
                            </div>
                        )}

                        {/* Online Indicator */}
                        {chat.isOnline && (
                            <span className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">
                                {chat.user_name}
                            </h4>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                            {chat.lastMessage || 'No messages yet'}
                        </p>
                    </div>
                </div>
            }
        />
    ));

    return (
        <div className="w-[280px] border-r-[0.01rem] border-r-[#e6e6e6] h-full px-3 bg-[#f6f6f6] flex flex-col">
            <div className="h-[60px] flex items-center justify-start gap-4">
                {/* hamburgur menu btn */}
                <Button
                    btnText={
                        <div className="size-[20px] fill-[#434343] group-hover:fill-[#4977ec]">
                            {icons.hamburgur}
                        </div>
                    }
                    onClick={() => {
                        setShowSideBar((prev) => !prev);
                    }}
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md w-fit"
                />

                {/* logo */}
                <Link
                    to={'/'}
                    className="flex items-center justify-center gap-3 text-nowrap font-medium text-lg"
                >
                    <div className="overflow-hidden rounded-full size-[40px] drop-shadow-md hover:scale-110 transition-all duration-300">
                        <img
                            src={LOGO}
                            alt="peer connect logo"
                            className="object-cover size-full hover:brightness-95"
                        />
                    </div>
                    <div className="hidden xs:block hover:scale-110 transition-all duration-300">
                        PeerConnect
                    </div>
                </Link>
            </div>

            <hr className="mb-3" />

            {/* Search Bar */}
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search or start new chat"
                    className="border border-b-[0.15rem] focus:border-b-[#4977ec] w-full indent-9 pr-3 py-[5px] bg-[#fbfbfb] focus:bg-white rounded-md focus:outline-none"
                />
                <div className="size-[15px] fill-[#b5b5b5] absolute left-3 top-[50%] transform translate-y-[-50%]">
                    {icons.search}
                </div>
            </div>

            {loading ? (
                <div>loading...</div>
            ) : (
                // user list
                <div className="flex-1 overflow-y-auto">
                    {chats.length > 0 ? (
                        chatElements
                    ) : (
                        <p className="text-sm text-gray-500 p-4">
                            No users found.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
