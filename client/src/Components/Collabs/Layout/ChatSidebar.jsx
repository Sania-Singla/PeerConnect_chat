import { useNavigate } from 'react-router-dom';
import { icons } from '../../../Assets/icons';
import { useChatContext } from '../../../Context';

export default function ChatSidebar({ users, onUserSelect }) {
    const { setSelectedChat } = useChatContext();
    // Example `users` prop structure:
    users = [
        {
            id: 1,
            name: 'John Doe',
            // avatar: 'https://example.com/avatar1.jpg',
            lastMessage: 'Hello!',
            isOnline: true,
        },
        {
            id: 2,
            name: 'Jane Smith',
            // avatar: 'https://example.com/avatar2.jpg',
            lastMessage: 'How are you?',
            isOnline: false,
        },
    ];
    const navigate = useNavigate();

    return (
        <div className="w-64 h-full bg-white shadow-md flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search or start new chat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <button
                            key={user.id}
                            // onClick={() => onUserSelect(user)}
                            onClick={() => {
                                setSelectedChat(user);
                                navigate('chat/456');
                            }}
                            className="flex items-center p-3 hover:bg-gray-100 focus:outline-none w-full text-left"
                        >
                            {/* Avatar Wrapper */}
                            <div className="relative">
                                {/* Avatar */}
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="User Avatar"
                                        className="w-12 h-12 rounded-full border border-gray-200"
                                    />
                                ) : (
                                    <div className="size-12 fill-gray-300 drop-shadow-md">
                                        {icons.circleUser}
                                    </div>
                                )}

                                {/* Online Indicator */}
                                {user.isOnline && (
                                    <span className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            {/* User Info */}
                            <div className="ml-3 flex-1">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-semibold text-gray-800 truncate">
                                        {user.name}
                                    </h4>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.lastMessage || 'No messages yet'}
                                </p>
                            </div>
                        </button>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 p-4">No users found.</p>
                )}
            </div>
        </div>
    );
}
