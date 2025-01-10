import { useRef, useState } from 'react';
import { Button } from '../..';
import { icons } from '../../../Assets/icons';
import { useChatContext, useSocketContext } from '../../../Context';
import { fileSizeRestriction } from '../../../Utils';
import { chatService } from '../../../Services';
import { useNavigate, useParams } from 'react-router-dom';

export default function ChatInput() {
    const [message, setMessage] = useState({
        attachment: null,
        text: '',
    });
    const { setMessages, setChats, selectedChat } = useChatContext();
    const attachmentRef = useRef();
    const { chatId } = useParams();
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const { socket } = useSocketContext();
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState({
        attachment: '',
    });
    const navigate = useNavigate();

    async function handleSend(e) {
        e.preventDefault();

        // update last message
        setChats((prev) =>
            prev.map((chat) => {
                if (chat.chat_id === chatId) {
                    return {
                        ...chat,
                        lastMessage: message.text || message.attachment?.name,
                    };
                } else {
                    return chat;
                }
            })
        );

        try {
            const res = await chatService.sendMessage(chatId, message);
            if (res && !res.message) {
                setMessages((prev) => [...prev, res]);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setMessage({ text: '', attachment: null });
            setAttachmentPreview(null);
        }
    }

    function handleChange(e) {
        const { name, value, files, type } = e.target;

        if (type === 'file' && files[0]) {
            const file = files[0];
            setMessage((prev) => ({ ...prev, [name]: file }));
            fileSizeRestriction(file, name, setError);

            const isVideo = file.type.startsWith('video/');

            if (isVideo) {
                const videoURL = URL.createObjectURL(file);
                setAttachmentPreview(videoURL);
            } else {
                const reader = new FileReader();

                reader.onloadend = () => {
                    setAttachmentPreview(reader.result);
                };

                reader.readAsDataURL(file);
            }
        } else {
            setMessage((prev) => ({ ...prev, [name]: value }));

            // Emit typing event
            if (value.trim() && !typing) {
                setTyping(true);
                socket.emit('typing', {
                    chatId,
                    participantId: selectedChat.user_id,
                });
            } else if (!value.trim() && typing) {
                setTyping(false);
                socket.emit('stoppedTyping', {
                    chatId,
                    participantId: selectedChat.user_id,
                });
            }
        }
    }

    let filePreview;
    if (attachmentPreview) {
        if (message.attachment?.type?.startsWith('video/')) {
            filePreview = (
                <video
                    src={attachmentPreview}
                    controls
                    className="w-full aspect-[1.618] rounded-lg object-cover"
                />
            );
        } else if (message.attachment?.type?.startsWith('image/')) {
            filePreview = (
                <img
                    src={attachmentPreview}
                    alt="attachment preview"
                    className="w-full aspect-[1.618] rounded-lg object-cover"
                />
            );
        } else {
            filePreview = (
                <div className="w-[150px] text-white aspect-[1.618] rounded-lg p-2 bg-blue-500">
                    <div className="h-full p-2 bg-[#ffffff42] rounded-lg flex flex-col items-center justify-center">
                        <div className="w-full flex items-center justify-center gap-1">
                            <div className="w-[25px] h-[25px] stroke-[#f6f6f6] fill-none">
                                {icons.doc}
                            </div>
                            <p className="text-sm max-w-[80px] truncate">
                                {message.attachment?.name}
                            </p>
                        </div>

                        <div className="w-full text-xs text-center text-gray-100">
                            {(
                                message.attachment?.size /
                                (1024 * 1024)
                            ).toPrecision(2)}{' '}
                            MB
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="">
            {attachmentPreview && (
                <div className="p-4 flex absolute bottom-[60px] w-fit">
                    <div className="drop-shadow-md max-w-[150px]">
                        {error && (
                            <p className="text-center text-red-500 text-sm">
                                {error.attachment}
                            </p>
                        )}

                        {filePreview}
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSend}
                className="w-full px-4 h-[60px] border-t border-gray-200 bg-white flex items-center space-x-4"
            >
                {/* emoji Icon */}
                <Button
                    className="group"
                    title="emoji"
                    btnText={
                        <div className="size-6 fill-none stroke-[#5f5f5f] hover:stroke-[#4977ec]">
                            {icons.emoji}
                        </div>
                    }
                />

                {/* attachment Field */}
                <input
                    type="file"
                    name="attachment"
                    onChange={handleChange}
                    ref={attachmentRef}
                    className="hidden"
                />

                {/* Attachment Icon */}
                <Button
                    className="group"
                    title="Attachment"
                    onClick={() => attachmentRef.current.click()}
                    btnText={
                        <div className="size-6 fill-none stroke-[#5f5f5f] hover:stroke-[#4977ec]">
                            {icons.link}
                        </div>
                    }
                />

                {/* Input Field */}
                <div className="w-full">
                    <input
                        type="text"
                        autoFocus
                        name="text"
                        value={message.text}
                        onChange={handleChange}
                        placeholder="Type a message..."
                        className="w-full flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                {/* Send Button */}
                <Button
                    title="send"
                    type="submit"
                    className="group"
                    btnText={
                        <div className="group-hover:stroke-[#4977ec] size-6 fill-none stroke-[#5f5f5f]">
                            {icons.send}
                        </div>
                    }
                />
            </form>
        </div>
    );
}
