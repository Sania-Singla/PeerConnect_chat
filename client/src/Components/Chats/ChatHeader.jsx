import { Button } from '..';
import { icons } from '../../Assets/icons';
import { useChatContext } from '../../Context';

export default function ChatHeader() {
    const { selectedChat, chatStatus } = useChatContext();

    return (
        <div className="bg-[#f6f6f6] h-[60px] border-b-[0.01rem] border-b-[#e6e6e6] flex items-center justify-between px-4">
            <div className="flex items-center w-fit">
                {/* Avatar */}
                {selectedChat?.isGroupChat ? (
                    <div className="flex items-center -space-x-9">
                        {selectedChat?.avatar.map((url, i) => (
                            <div
                                key={i}
                                className="size-[50px] border border-[#434343] rounded-full overflow-hidden"
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
                    <div className="size-[50px] border border-[#434343] rounded-full overflow-hidden">
                        <img
                            src={selectedChat?.avatar}
                            alt="User Avatar"
                            className="object-cover w-full h-full rounded-full"
                        />
                    </div>
                )}

                <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                        {selectedChat?.chat_name}
                    </h4>

                    {selectedChat?.isGroupChat ? (
                        chatStatus?.membersTyping.length > 0 ? (
                            <span className="text-sm text-green-500">
                                {chatStatus?.membersTyping
                                    .slice(0, 3)
                                    .map(({ user_firstName, user_id }) => (
                                        <span key={user_id}>
                                            {user_firstName},{' '}
                                        </span>
                                    ))}{' '}
                                are typing
                            </span>
                        ) : chatStatus?.membersOnline.length > 0 ? (
                            <span className="text-sm text-green-500">
                                {chatStatus?.membersOnline
                                    .slice(0, 3)
                                    .map(({ user_firstName, user_id }) => (
                                        <span key={user_id}>
                                            {user_firstName},{' '}
                                        </span>
                                    ))}
                                are online
                            </span>
                        ) : (
                            <span className="text-sm text-red-400">
                                All are offline
                            </span>
                        )
                    ) : chatStatus?.membersTyping.length > 0 ? (
                        <span className="text-sm text-green-500">
                            typing...
                        </span>
                    ) : (
                        <span
                            className={`text-sm ${
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

            <div className="flex items-center gap-4">
                <Button
                    className="bg-[#ffffff] p-[9px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                    title="Start Video Call"
                    btnText={
                        <div className="size-[23px] fill-none stroke-[#434343] hover:stroke-[#4977ec]">
                            {icons.video}
                        </div>
                    }
                />

                <Button
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                    title="Close Chat"
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
