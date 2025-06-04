import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useChatContext, useUserContext } from '@/Context';

export default function ChatHeader() {
    const { selectedChat, setShowSidebar } = useChatContext();
    const navigate = useNavigate();
    const { user } = useUserContext();

    return (
        <div className="bg-[#f6f6f6] h-[60px] border-b-[0.01rem] border-b-[#e6e6e6] flex gap-4 items-center px-4">
            <Button
                className={`sm:hidden group flex items-center justify-center cursor-pointer`}
                title="Show Chats"
                onClick={() => setShowSidebar(true)}
                btnText={
                    <div className="size-[16px] fill-[#2b2b2b] group-hover:fill-[#4977ec]">
                        {icons.chevronRight}
                    </div>
                }
            />

            <div className="flex items-center justify-between w-full">
                <div
                    className="flex items-center w-fit cursor-pointer"
                    onClick={() => navigate('details')}
                >
                    {/* Avatar */}
                    {selectedChat?.chat?.isGroupChat ? (
                        <div className="flex items-center -space-x-5">
                            {selectedChat?.chat?.avatar.map((url, i) => (
                                <div
                                    key={i}
                                    className="size-[35px] border border-[#434343] rounded-full overflow-hidden"
                                    style={{
                                        zIndex:
                                            selectedChat?.chat?.avatar.length -
                                            i,
                                    }}
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
                        <div>
                            <div className="size-[35px] border border-[#434343] rounded-full overflow-hidden">
                                <img
                                    loading="lazy"
                                    src={selectedChat?.chat?.avatar}
                                    alt="User Avatar"
                                    className="object-cover size-full rounded-full"
                                />
                            </div>
                        </div>
                    )}

                    <div className="ml-3">
                        <h4 className="text-[15px] line-clamp-1 font-semibold text-gray-800">
                            {selectedChat?.chat?.chat_name}
                        </h4>

                        <div className="text-xs">
                            {selectedChat?.chat?.isGroupChat ? (
                                selectedChat?.membersTyping.filter(
                                    ({ user_id }) => user_id !== user.user_id
                                ).length > 0 ? (
                                    <span className="text-green-500 line-clamp-1">
                                        {selectedChat?.membersTyping
                                            .filter(
                                                ({ user_id }) =>
                                                    user_id !== user.user_id
                                            )
                                            .slice(0, 3)
                                            .map(
                                                ({
                                                    user_fullName,
                                                    user_id,
                                                }) => (
                                                    <span key={user_id}>
                                                        {user_fullName},{' '}
                                                    </span>
                                                )
                                            )}{' '}
                                        {selectedChat?.membersTyping.filter(
                                            ({ user_id }) =>
                                                user_id !== user.user_id
                                        ).length > 1
                                            ? 'are '
                                            : 'is '}
                                        typing
                                    </span>
                                ) : selectedChat?.membersOnline.filter(
                                      ({ user_id }) => user_id !== user.user_id
                                  ).length > 0 ? (
                                    <span className="text-green-500 line-clamp-1">
                                        {selectedChat?.membersOnline
                                            .filter(
                                                ({ user_id }) =>
                                                    user_id !== user.user_id
                                            )
                                            ?.slice(0, 3)
                                            .map(
                                                ({
                                                    user_fullName,
                                                    user_id,
                                                }) => (
                                                    <span key={user_id}>
                                                        {user_fullName},{' '}
                                                    </span>
                                                )
                                            )}
                                        {selectedChat?.membersOnline.filter(
                                            ({ user_id }) =>
                                                user_id !== user.user_id
                                        ).length > 1
                                            ? 'are '
                                            : 'is '}{' '}
                                        online
                                    </span>
                                ) : (
                                    <span className="text-red-400 line-clamp-1">
                                        All are offline
                                    </span>
                                )
                            ) : selectedChat?.membersTyping.filter(
                                  ({ user_id }) => user_id !== user.user_id
                              ).length > 0 ? (
                                <span className="text-green-500">
                                    typing...
                                </span>
                            ) : (
                                <span
                                    className={`${
                                        selectedChat?.membersOnline.filter(
                                            ({ user_id }) =>
                                                user_id !== user.user_id
                                        ).length > 0
                                            ? 'text-green-500'
                                            : 'text-red-400'
                                    }`}
                                >
                                    {selectedChat?.membersOnline.filter(
                                        ({ user_id }) =>
                                            user_id !== user.user_id
                                    ).length > 0
                                        ? 'Online'
                                        : 'Offline'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex align-items-center gap-5">
                    {/* <Button
                        btnText={
                            <div className="size-[18px] fill-[#2b2b2b] group-hover:fill-[#4977ec]">
                                {icons.video}
                            </div>
                        }
                        title="Video Call"
                        className="flex items-center justify-center cursor-pointer group"
                    /> */}

                    <Button
                        onClick={() => navigate('/chat')}
                        btnText={
                            <div className="size-[18px] stroke-[#2b2b2b] group-hover:stroke-red-600">
                                {icons.cross}
                            </div>
                        }
                        title="Close chat"
                        className="flex items-center justify-center cursor-pointer group"
                    />
                </div>
            </div>
        </div>
    );
}
