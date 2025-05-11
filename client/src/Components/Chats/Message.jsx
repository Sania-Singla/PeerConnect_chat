import { useUserContext, useChatContext } from '../../Context';
import { FilePreview, Button } from '..';
import { memo } from 'react';
import { TAILWIND_COLORS } from '../../Constants/constants';
import { formatTime } from '../../Utils';

const Message = memo(({ message, reference }) => {
    const { user } = useUserContext();
    const { selectedChat } = useChatContext();
    const {
        sender_id,
        text,
        attachments,
        message_createdAt,
        message_updatedAt,
        sender,
    } = message;

    const isSender = sender_id === user.user_id;

    function getRandomColor() {
        return TAILWIND_COLORS[
            Math.floor(Math.random() * TAILWIND_COLORS.length)
        ];
    }

    return (
        <div
            ref={reference}
            className={`flex w-full ${
                isSender ? 'justify-end pl-8' : 'justify-start pr-8'
            }`}
        >
            {/* Message Bubble */}
            <div
                className={`w-fit max-w-[600px] p-2 pb-[3px] flex flex-col gap-1 rounded-lg ${
                    isSender
                        ? 'bg-blue-500 text-white self-end'
                        : 'bg-gray-200 text-gray-800 self-start'
                }`}
            >
                {/* sender name */}
                {selectedChat.chat.isGroupChat && !isSender && (
                    <div
                        className={`${getRandomColor()} font-medium text-sm`}
                    >{`${sender?.user_firstName} ${sender?.user_lastName}`}</div>
                )}

                {/* Attachment Section */}
                {attachments.length > 0 && (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
                        {attachments.slice(0, 3).map((attachment, i) => (
                            <FilePreview
                                key={i}
                                attachment={attachment}
                                senderId={sender_id}
                            />
                        ))}

                        {/* Display +1 if there are more than 4 attachments */}
                        {attachments.length > 3 && (
                            <div
                                className={`w-full rounded-md mb-2 ${
                                    isSender ? 'bg-blue-400' : 'bg-gray-300'
                                }`}
                            >
                                <Button
                                    title="View More"
                                    btnText={`+${attachments.length - 3}`}
                                    className="text-white w-full h-full text-xl hover:bg-[#2564eb44] hover:text-2xl hover:scale-100 rounded-md py-2 px-4"
                                    onClick={
                                        () => alert('View more attachments') // Handle the action when user clicks +1 (e.g., open all attachments)
                                    }
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* // todo: can add read more expansion */}
                <div className="flex justify-between gap-3">
                    <p
                        className={`text-sm leading-tight pb-[3px] ${isSender ? 'text-white' : 'text-gray-800'}`}
                    >
                        {text}
                    </p>
                    <p
                        className={`text-end text-[9px] ${
                            text && 'relative top-[7px]'
                        } ${isSender ? 'text-[#ffffffce]' : 'text-[#0000007f]'}`}
                    >
                        {formatTime(message_createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default Message;
