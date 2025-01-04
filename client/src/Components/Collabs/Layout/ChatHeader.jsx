import { Button } from '../..';
import { icons } from '../../../Assets/icons';

export default function ChatHeader({ user }) {
    // Example structure for "user"
    user = {
        name: 'John Doe',
        // avatar: 'https://example.com/avatar.jpg',
        status: 'online', // "offline" or "online"
    };

    return (
        <div className="bg-[#f6f6f6] flex items-center justify-between px-4 py-3 drop-shadow-md">
            {/* Left Section */}
            <div className="flex items-center">
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
                <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                        {user?.name || 'Anonymous'}
                    </h4>
                    <span
                        className={`text-sm ${
                            user?.status === 'online'
                                ? 'text-green-500'
                                : 'text-red-400'
                        }`}
                    >
                        {user?.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                <Button
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                    title="Start Video Call"
                    btnText={
                        <div className="size-[20px] fill-[#242424] group-hover:fill-[#4977ec]">
                            {icons.video}
                        </div>
                    }
                />

                <Button
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                    title="Close Chat"
                    btnText={
                        <div className="size-[20px] stroke-[#242424] group-hover:stroke-red-600">
                            {icons.cross}
                        </div>
                    }
                />
            </div>
        </div>
    );
}
