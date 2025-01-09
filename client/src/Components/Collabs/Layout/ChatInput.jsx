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

    return (
        <div className="">
            {attachmentPreview && (
                <div className="p-4 flex absolute bottom-[60px] w-fit">
                    {/* attachment array */}
                    <div className="drop-shadow-md max-w-[150px]">
                        {error && (
                            <p className="text-center text-red-500 text-sm">
                                {error.attachment}
                            </p>
                        )}

                        {attachmentPreview.startsWith('blob:') ? (
                            <video
                                src={attachmentPreview}
                                controls
                                className="w-full aspect-[1.618] rounded-lg object-cover"
                            />
                        ) : (
                            <img
                                src={attachmentPreview}
                                alt="attachment preview"
                                className="w-full aspect-[1.618] rounded-lg object-cover"
                            />
                        )}
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
