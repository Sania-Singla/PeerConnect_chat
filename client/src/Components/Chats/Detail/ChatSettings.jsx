import { useParams } from 'react-router-dom';
import { useChatContext } from '@/Context';
import { useState } from 'react';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { chatService } from '@/Services';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { formatDateRelative } from '@/Utils';

export default function ChatSettings() {
    const { selectedChat } = useChatContext();
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

    async function deleteChat() {
        try {
            setDeleting(true);
            const res = await chatService.deleteChat(chatId);
            if (res && !res.message) {
                toast.success('Chat deleted successfully');
                navigate('/chat');
            } else {
                toast.error(res?.message || 'Failed to delete chat');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setDeleting(false);
            setShowLeaveConfirmation(false);
        }
    }

    return (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Chat Information
                </h2>

                {/* Chat Details Section */}
                <div className="">
                    <div className="flex gap-6 items-center">
                        <div className="">
                            <img
                                src={selectedChat.chat.avatar}
                                alt="Chat Avatar"
                                className="size-[100px] object-cover border drop-shadow-md border-gray-800 rounded-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {selectedChat.chat.chat_name}
                            </h3>
                            <span className="text-gray-600 mb-1">
                                Connected:{' '}
                                {formatDateRelative(
                                    selectedChat.chat.chat_createdAt
                                )}
                            </span>
                            <div
                                className={`w-fit ${selectedChat.chat.isOnline ? 'text-green-600 bg-[#00ff1517]' : 'text-red-500 bg-[#ff6c6c22]'} mb-2 font-medium rounded-full px-2 text-xs py-[2px] `}
                            >
                                {selectedChat.chat.isOnline
                                    ? 'Online'
                                    : 'Offline'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="w-full">
                    <h3 className="text-lg font-medium text-red-700 mb-4">
                        Danger Zone
                    </h3>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-700 mb-3">
                            Deleting this chat will remove you from all
                            connections. This action cannot be undone.
                        </p>

                        {showLeaveConfirmation ? (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    className="w-full sm:w-[140px] h-[40px] bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center"
                                    onClick={deleteChat}
                                    disabled={deleting}
                                    btnText={
                                        deleting ? (
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 mr-2 animate-spin">
                                                    {icons.loading}
                                                </div>
                                                Deleting...
                                            </div>
                                        ) : (
                                            'Confirm Delete'
                                        )
                                    }
                                />
                                <Button
                                    className="w-full sm:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                                    onClick={() =>
                                        setShowLeaveConfirmation(false)
                                    }
                                    btnText="Cancel"
                                />
                            </div>
                        ) : (
                            <Button
                                className="w-full sm:w-[130px] py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                onClick={() => setShowLeaveConfirmation(true)}
                                btnText="Delete Chat"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
