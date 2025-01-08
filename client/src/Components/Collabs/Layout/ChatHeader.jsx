import { useNavigate } from 'react-router-dom';
import { Button } from '../..';
import { icons } from '../../../Assets/icons';
import { useChatContext } from '../../../Context';

export default function ChatHeader() {
    const { selectedChat } = useChatContext();
    const navigate = useNavigate();

    return (
        <div className="bg-[#f6f6f6] h-[60px] border-b-[0.01rem] border-b-[#e6e6e6] flex items-center justify-between px-4 py-3">
            {/* Left Section */}
            <div
                className="flex items-center w-fit"
                onClick={() => navigate(`/channel/${selectedChat?.user_id}`)}
            >
                <div className="size-12 rounded-full overflow-hidden">
                    <img
                        src={selectedChat?.user_avatar}
                        alt="User Avatar"
                        className="size-full rounded-full border border-gray-200"
                    />
                </div>
                <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                        {selectedChat?.user_firstName}{' '}
                        {selectedChat?.user_lastName}
                    </h4>
                    <span
                        className={`text-sm ${
                            selectedChat?.isOnline
                                ? 'text-green-500'
                                : 'text-red-400'
                        }`}
                    >
                        {selectedChat?.isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            {/* Right Section */}
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
