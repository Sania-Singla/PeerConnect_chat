import { useNavigate } from 'react-router-dom';
import { Button } from '../..';
import { icons } from '../../../Assets/icons';
import { useChatContext } from '../../../Context';

export default function ChatHeader() {
    const { selectedChat } = useChatContext();
    const navigate = useNavigate();

    return (
        <div className="bg-[#f6f6f6] h-[60px] border-b-[0.01rem] border-b-[#e6e6e6] flex items-center justify-between px-4">
            <div
                className="flex items-center w-fit cursor-pointer"
                onClick={() => navigate('details')}
            >
                {/* Avatar */}
                {selectedChat?.chat?.isGroupChat ? (
                    <div className="flex items-center -space-x-7">
                        {selectedChat?.chat?.avatar.map((url, i) => (
                            <div
                                key={i}
                                className="size-[40px] border border-[#434343] rounded-full overflow-hidden"
                                style={{
                                    zIndex:
                                        selectedChat?.chat?.avatar.length - i,
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
                        <div className="size-[40px] border border-[#434343] rounded-full overflow-hidden">
                            <img
                                src={selectedChat?.chat?.avatar}
                                alt="User Avatar"
                                className="object-cover size-full rounded-full"
                            />
                        </div>
                    </div>
                )}

                <div className="ml-3">
                    <h4 className="text-base line-clamp-1 font-semibold text-gray-800">
                        {selectedChat?.chat?.chat_name}
                    </h4>

                    <div className="font-medium text-[12px]">
                        {selectedChat?.chat?.isGroupChat ? (
                            selectedChat?.membersTyping?.length > 0 ? (
                                <span className="text-green-500 line-clamp-1">
                                    {selectedChat?.membersTyping
                                        ?.slice(0, 3)
                                        .map(({ user_firstName, user_id }) => (
                                            <span key={user_id}>
                                                {user_firstName},{' '}
                                            </span>
                                        ))}{' '}
                                    are typing
                                </span>
                            ) : selectedChat?.membersOnline?.length > 0 ? (
                                <span className="text-green-500 line-clamp-1">
                                    {selectedChat?.membersOnline
                                        ?.slice(0, 3)
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
                        ) : selectedChat?.membersTyping?.length > 0 ? (
                            <span className="text-green-500">typing...</span>
                        ) : (
                            <span
                                className={`${
                                    selectedChat?.membersOnline?.length > 0
                                        ? 'text-green-500'
                                        : 'text-red-400'
                                }`}
                            >
                                {selectedChat?.membersOnline?.length > 0
                                    ? 'Online'
                                    : 'Offline'}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-x-4">
                <Button
                    className="bg-[#ffffff] pt-2 pb-[5px] px-[7px] items-center flex justify-center group rounded-full drop-shadow-md"
                    title="Start Video Call"
                    btnText={
                        <div className="size-[18px] fill-[#1a1a1a] group-hover:fill-[#4977ec]">
                            {icons.video}
                        </div>
                    }
                />

                <Button
                    className="bg-[#ffffff] p-[6px] group rounded-full drop-shadow-md w-fit"
                    title="Close Chat"
                    onClick={() => navigate('/chat')}
                    btnText={
                        <div className="size-[19px] stroke-[#434343] group-hover:stroke-red-600">
                            {icons.cross}
                        </div>
                    }
                />
            </div>
        </div>
    );
}
