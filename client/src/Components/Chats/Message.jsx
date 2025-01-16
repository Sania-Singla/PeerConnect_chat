import { useUserContext, useChatContext } from '../../Context';
import { FilePreview, Button } from '..';
import { memo } from 'react';
import { TAILWIND_COLORS } from '../../Constants/constants';

const Message = memo(({ message }) => {
    const { user } = useUserContext();
    const {
        sender_id,
        text,
        attachments,
        message_createdAt,
        message_updatedAt,
        sender,
    } = message;

    const { selectedChat } = useChatContext();

    const isSender = sender_id === user.user_id;

    function getRandomColor() {
        return TAILWIND_COLORS[
            Math.floor(Math.random() * TAILWIND_COLORS.length)
        ];
    }

    return (
        <div
            // ref={reference}
            className={`flex w-full ${
                isSender ? 'justify-end pl-8' : 'justify-start pr-8'
            }`}
        >
            {/* Message Bubble */}
            <div
                className={`w-fit px-3 pt-3 pb-2 rounded-lg ${
                    isSender
                        ? 'bg-blue-500 text-white self-end'
                        : 'bg-gray-200 text-gray-800 self-start'
                }`}
            >
                {/* sender name */}
                {selectedChat.isGroupChat && !isSender && (
                    <div
                        className={`${getRandomColor()} font-medium text-[15px] mb-2`}
                    >{`${sender.user_firstName} ${sender.user_lastName}`}</div>
                )}

                {/* Attachment Section */}
                {attachments.length > 0 && (
                    <div className="max-w-[450px] grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] grid-flow-dense gap-2">
                        {attachments.slice(0, 4).map((attachment, i) => (
                            <FilePreview
                                attachment={attachment}
                                senderId={sender_id}
                            />
                        ))}
                    </div>
                )}

                {/* Display +1 if there are more than 4 attachments */}
                {attachments.length > 4 && (
                    <div
                        className={`w-full rounded-lg mb-2 ${
                            isSender ? 'bg-blue-400' : 'bg-gray-300'
                        }`}
                    >
                        <div className="flex items-center justify-center p-4">
                            <Button
                                title="View More"
                                btnText={`+${attachments.length - 4}`}
                                className="text-white bg-blue-600 hover:bg-blue-500 rounded-md py-2 px-4"
                                onClick={() => {
                                    // Handle the action when user clicks +1 (e.g., open all attachments)
                                    alert('View more attachments');
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* // todo: can add read more expansion */}
                {/* Text Section */}
                <p
                    className={`leading-tight ${isSender ? 'text-white' : 'text-gray-800'}`}
                >
                    {text}
                </p>

                {/* Timestamp */}
                <p
                    className={`relative text-end text-xs leading-tight ${
                        isSender ? 'text-[#ffffffbf]' : 'text-[#0000007f]'
                    }`}
                >
                    {new Date(message_createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
});

export default Message;
