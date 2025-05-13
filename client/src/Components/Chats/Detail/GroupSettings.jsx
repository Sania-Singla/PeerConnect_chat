import { useParams } from 'react-router-dom';
import { useChatContext } from '@/Context';
import { useState } from 'react';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { chatService } from '@/Services';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { formatDateRelative } from '@/Utils'; // Assuming you have a date formatting utility

export default function GroupSettings() {
    const { selectedChat } = useChatContext();
    const { chatId } = useParams();
    const [groupName, setGroupName] = useState(
        selectedChat.chat.chat_name || ''
    );
    const navigate = useNavigate();
    const [renaming, setRenaming] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

    function handleChange(e) {
        setGroupName(e.target.value);
    }

    async function handleUpdate() {
        if (!groupName.trim()) {
            toast.error('Group name cannot be empty');
            return;
        }

        try {
            setRenaming(true);
            const res = await chatService.renameGroup(chatId, groupName);
            if (res && !res.message) {
                toast.success('Group name updated successfully');
            } else {
                toast.error(res?.message || 'Failed to update group name');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setRenaming(false);
        }
    }

    async function leaveGroup() {
        try {
            setLeaving(true);
            const res = await chatService.leaveGroup(chatId);
            if (res && !res.message) {
                toast.success('You have left the group');
                navigate('/chat');
            } else if (res.message === 'group no longer exists') {
                toast.error('Group no longer exists');
                navigate('/chat');
            } else {
                toast.error(res?.message || 'Failed to leave group');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLeaving(false);
            setShowLeaveConfirmation(false);
        }
    }

    return (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">
                    Group Settings
                </h2>

                {/* Group Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Creator Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">
                            Group Creator
                        </h3>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="size-12 ">
                                    <img
                                        src={
                                            selectedChat.chat.creator
                                                .user_avatar
                                        }
                                        alt={`${selectedChat.chat.creator.user_name} avatar`}
                                        className="size-12 rounded-full object-cover"
                                    />
                                </div>
                                {selectedChat.membersOnline.find(
                                    (m) =>
                                        m.user_id ===
                                        selectedChat.chat.creator.user_id
                                ) && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {selectedChat.chat.creator.user_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Created{' '}
                                    {formatDateRelative(
                                        selectedChat.chat.chat_createdAt
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Group Name Section */}
                    <div className="space-y-2">
                        <label
                            htmlFor="groupName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Group Name
                        </label>
                        <div className="flex flex-col xl:flex-row gap-4">
                            <input
                                type="text"
                                id="groupName"
                                value={groupName}
                                onChange={handleChange}
                                placeholder="Enter group name"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                disabled={renaming}
                            />
                            <Button
                                className="w-full xl:w-[140px] h-[40px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                                disabled={renaming || !groupName.trim()}
                                onClick={handleUpdate}
                                btnText={
                                    renaming ? (
                                        <div className="flex items-center">
                                            <div className="size-5 mr-2 animate-spin">
                                                {icons.loading}
                                            </div>
                                            Saving
                                        </div>
                                    ) : (
                                        'Update'
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-red-700 mb-4">
                        Danger Zone
                    </h3>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-red-700 mb-3">
                            Leaving will remove you from this group. This action
                            cannot be undone.
                        </p>
                        {showLeaveConfirmation ? (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    className="w-full sm:w-[140px] h-[40px] bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                    onClick={leaveGroup}
                                    disabled={leaving}
                                    btnText={
                                        leaving ? (
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 mr-2 animate-spin">
                                                    {icons.loading}
                                                </div>
                                                Leaving...
                                            </div>
                                        ) : (
                                            'Confirm Leave'
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
                                btnText="Leave Group"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
