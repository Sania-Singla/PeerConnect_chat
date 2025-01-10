import { useUserContext } from '../../Context';
import { FilePreview } from '..';
import { memo } from 'react';

const Message = memo(({ message, reference }) => {
    const { user } = useUserContext();
    const { sender_id, text, attachment, fileName, message_createdAt } =
        message;

    const isSender = sender_id === user.user_id;
    console.log(message, reference);
    return (
        <div
            ref={reference}
            className={`flex ${
                isSender ? 'justify-end pl-10' : 'justify-start pr-10'
            }`}
        >
            {/* Message Bubble */}
            <div
                className={`max-w-[400px] w-fit p-[12px] pb-[6px] rounded-lg shadow-lg ${
                    isSender
                        ? 'bg-blue-500 text-white self-end' // For sender
                        : 'bg-gray-200 text-gray-800 self-start' // For receiver
                }`}
            >
                {/* Attachment Section */}
                {attachment && (
                    <FilePreview
                        attachment={attachment}
                        fileName={fileName}
                        senderId={sender_id}
                    />
                )}

                {/* Text Section */}
                <p
                    className={`leading-3 text-lg ${isSender ? 'text-white' : 'text-gray-800'}`}
                >
                    {text}
                </p>

                {/* Timestamp */}
                <p
                    className={`text-end text-xs mt-2 ${
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
