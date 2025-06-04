import { useUserContext, useChatContext } from '@/Context';
import { FilePreview, Button } from '@/Components';
import { memo, useState } from 'react';
import { TAILWIND_COLORS } from '@/Constants/constants';
import { formatTime } from '@/Utils';

const Message = memo(({ message, reference }) => {
    const { user } = useUserContext();
    const { selectedChat } = useChatContext();
    const [showAllAttachments, setShowAllAttachments] = useState(false);
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

    const isFilePreviewable = (type) =>
        type.startsWith('image/') || type.startsWith('video/');

    const previewableAttachments = attachments.filter((att) =>
        isFilePreviewable(att.type)
    );

    const documentAttachments = attachments.filter(
        (att) => att.type === 'application/pdf' || att.type.includes('document')
    );

    return (
        <div
            ref={reference}
            className={`flex w-full ${
                isSender ? 'justify-end pl-8' : 'justify-start pr-8'
            }`}
        >
            <div
                className={`w-fit max-w-[600px] p-2 pb-[3px] flex flex-col gap-1 rounded-lg rounded-br-none ${
                    isSender
                        ? 'bg-[#4977ec] text-white self-end'
                        : 'bg-gray-200 text-gray-800 self-start'
                }`}
            >
                {/* sender name */}
                {selectedChat.chat.isGroupChat && !isSender && (
                    <div className={`${getRandomColor()} font-medium text-sm`}>
                        {sender?.user_fullName}
                    </div>
                )}

                {attachments.length > 0 && (
                    <div className="flex flex-col gap-2">
                        {/* Separate list of PDFs/Documents */}
                        {documentAttachments.length > 0 && (
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
                                {documentAttachments.map((attachment, i) => (
                                    <FilePreview
                                        key={i}
                                        attachment={attachment}
                                        senderId={sender_id}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Grid of images/videos */}
                        {previewableAttachments.length > 0 && (
                            <>
                                <div className="grid grid-flow-dense grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
                                    {(showAllAttachments
                                        ? previewableAttachments
                                        : previewableAttachments.slice(0, 3)
                                    ).map((attachment, i) => (
                                        <div
                                            key={i}
                                            className="h-[100px] w-full"
                                        >
                                            <FilePreview
                                                attachment={attachment}
                                                senderId={sender_id}
                                            />
                                        </div>
                                    ))}
                                    {/* Expand Button */}
                                    {previewableAttachments.length > 3 &&
                                        !showAllAttachments && (
                                            <Button
                                                title="Expand"
                                                btnText={`+${previewableAttachments.length - 3}`}
                                                className="self-start text-black hover:underline bg-[#00000040] h-full w-full rounded-lg"
                                                onClick={() =>
                                                    setShowAllAttachments(true)
                                                }
                                            />
                                        )}
                                </div>

                                {showAllAttachments && (
                                    <Button
                                        title="Show Less"
                                        btnText="Show Less"
                                        className="self-start text-black hover:underline bg-[#00000040] h-full py-2 w-full rounded-lg"
                                        onClick={() =>
                                            setShowAllAttachments(false)
                                        }
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="flex justify-between gap-3">
                    <p
                        className={`text-sm leading-tight pb-[3px] ${isSender ? 'text-white' : 'text-gray-800'}`}
                    >
                        {text}
                    </p>
                    <p
                        className={`text-end text-[10px] ${
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
