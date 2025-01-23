import { useNavigate } from 'react-router-dom';
import { Button } from '..';
import { icons } from '../../Assets/icons';
import { useChatContext } from '../../Context';

export default function ChatHeader() {
    const { selectedChat, chatStatus } = useChatContext();
    const navigate = useNavigate();

    return (
        <div className="bg-[#f6f6f6] h-[60px] border-b-[0.01rem] border-b-[#e6e6e6] flex items-center justify-between px-4">
            <div
                className="flex items-center w-fit cursor-pointer"
                onClick={() => navigate('details')}
            >
                {/* Avatar */}
                {selectedChat?.isGroupChat ? (
                    <div className="flex items-center -space-x-7">
                        {selectedChat?.avatar.map((url, i) => (
                            <div
                                key={i}
                                className="size-[45px] border border-[#434343] rounded-full overflow-hidden"
                                style={{
                                    zIndex: selectedChat?.avatar.length - i,
                                }}
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
                    <div>
                        <div className="size-[45px] border border-[#434343] rounded-full overflow-hidden">
                            <img
                                src={selectedChat?.avatar}
                                alt="User Avatar"
                                className="object-cover size-full rounded-full"
                            />
                        </div>
                    </div>
                )}

                <div className="ml-3">
                    <h4 className="text-base line-clamp-1 font-semibold text-gray-800">
                        {selectedChat?.chat_name}
                    </h4>

                    <div className="font-medium text-[12px]">
                        {selectedChat?.isGroupChat ? (
                            chatStatus.membersTyping.length > 0 ? (
                                <span className="text-green-500 line-clamp-1">
                                    {chatStatus?.membersTyping
                                        .slice(0, 3)
                                        .map(({ user_firstName, user_id }) => (
                                            <span key={user_id}>
                                                {user_firstName},{' '}
                                            </span>
                                        ))}{' '}
                                    are typing
                                </span>
                            ) : chatStatus.membersOnline.length > 0 ? (
                                <span className="text-green-500 line-clamp-1">
                                    {chatStatus.membersOnline
                                        .slice(0, 3)
                                        .map(({ user_firstName, user_id }) => (
                                            <span key={user_id}>
                                                {user_firstName},{' '}
                                            </span>
                                        ))}
                                    are online
                                </span>
                            ) : (
                                <span className="text-red-400 line-clamp-1">
                                    All are offline
                                </span>
                            )
                        ) : chatStatus?.membersTyping.length > 0 ? (
                            <span className="text-green-500">typing...</span>
                        ) : (
                            <span
                                className={`${
                                    chatStatus?.membersOnline.length > 0
                                        ? 'text-green-500'
                                        : 'text-red-400'
                                }`}
                            >
                                {chatStatus?.membersOnline.length > 0
                                    ? 'Online'
                                    : 'Offline'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-x-4">
                <Button
                    className="bg-[#ffffff] p-[6px] group rounded-full drop-shadow-md"
                    title="Start Video Call"
                    btnText={
                        <div className="size-[23px] fill-none stroke-[#434343] group-hover:stroke-[#4977ec]">
                            {icons.video}
                        </div>
                    }
                />

                <Button
                    className="bg-[#ffffff] p-2 group rounded-full drop-shadow-md w-fit"
                    title="Close Chat"
                    onClick={() => navigate('/chats')}
                    btnText={
                        <div className="size-[20px] stroke-[#434343] group-hover:stroke-red-600">
                            {icons.cross}
                        </div>
                    }
                />
            </div>
        </div>
    );
}
