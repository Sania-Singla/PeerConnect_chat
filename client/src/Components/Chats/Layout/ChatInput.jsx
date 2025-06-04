import { useRef, useState, useEffect } from 'react';
import { Button, InputFilePreview } from '@/Components';
import { useParams, useNavigate } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { fileSizeRestriction } from '@/Utils';
import { chatService } from '@/Services';
import { useSocketContext } from '@/Context';
import toast from 'react-hot-toast';
import { MAX_FILE_SIZE } from '@/Constants/constants';
import EmojiPicker from 'emoji-picker-react';

export default function ChatInput() {
    const [message, setMessage] = useState({ attachments: [], text: '' });
    const { socket } = useSocketContext();
    const { chatId } = useParams();
    const [typing, setTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const attachmentRef = useRef();
    const [attachmentPreviews, setAttachmentPreviews] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef();
    const emojiPickerRef = useRef();
    const emojiButtonRef = useRef();

    // auto focus input field
    useEffect(() => inputRef.current?.focus(), [chatId]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(e.target) &&
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(e.target)
            ) {
                setShowEmojiPicker(false);
            }
        }

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showEmojiPicker]);

    async function handleSend(e) {
        e.preventDefault();

        if (!message.text.trim() && message.attachments.length === 0) {
            toast.error('Message cannot be empty');
            return;
        }

        try {
            setLoading(true);
            const res = await chatService.sendMessage(chatId, message);
            if (res && !res.message) {
                setTyping(false);
                socket.emit('stoppedTyping', chatId);
            } else toast.error(res.message || 'Failed to send message');
        } catch (err) {
            navigate('/server-error');
        } finally {
            setMessage({ text: '', attachments: [] });
            setAttachmentPreviews([]);
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { value, files = [], type } = e.target;
        if (type === 'file' && files.length) {
            if (message.attachments.length + files.length > 5) {
                return toast.error('Maximum 5 attachments are allowed');
            }

            const newAttachments = [];
            const newPreviews = [];

            for (let file of files) {
                if (!fileSizeRestriction(file)) {
                    toast.error(
                        `File size should not exceed ${MAX_FILE_SIZE} MB`
                    );
                    continue;
                }

                newAttachments.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }

            setMessage((prev) => ({
                ...prev,
                attachments: [...prev.attachments, ...newAttachments],
            }));
            setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
        } else {
            setMessage((prev) => ({ ...prev, text: value }));

            // Emit typing event
            if (value.trim() && !typing) {
                setTyping(true);
                socket.emit('typing', chatId);
            } else if (!value.trim() && typing) {
                setTyping(false);
                socket.emit('stoppedTyping', chatId);
            }
        }
    }

    function removeAttachment(index) {
        setMessage((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
        setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function handleEmojiClick(emojiData) {
        setMessage((prev) => ({ ...prev, text: prev.text + emojiData.emoji }));
        inputRef.current.focus();
    }

    return (
        <div className="relative h-full">
            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className="absolute bottom-[70px] left-6 z-10"
                >
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={350}
                        theme="auto"
                    />
                </div>
            )}

            {/* Previews */}
            {attachmentPreviews.length > 0 && (
                <div className="flex space-x-4 items-center p-4 overflow-x-scroll w-full absolute bottom-[60px]">
                    {attachmentPreviews.map((file, i) => (
                        <InputFilePreview
                            file={message.attachments[i]}
                            previewURL={file}
                            key={i}
                            index={i}
                            removeAttachment={removeAttachment}
                        />
                    ))}
                </div>
            )}

            {/* form */}
            <form
                onSubmit={handleSend}
                className="w-full px-6 h-full border-t border-gray-300 flex items-center space-x-6"
            >
                {/* emoji Icon */}
                <Button
                    className="group"
                    title="emoji"
                    type="button"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    btnText={
                        <div
                            ref={emojiButtonRef}
                            className="size-6 fill-none stroke-[#434343] hover:stroke-[#4977ec]"
                        >
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
                    multiple
                />

                {/* Attachment Icon */}
                <Button
                    className="group"
                    title="Attachment"
                    onClick={() => attachmentRef.current.click()}
                    btnText={
                        <div className="size-6 fill-none stroke-[#434343] hover:stroke-[#4977ec]">
                            {icons.link}
                        </div>
                    }
                />

                {/* Input Field */}
                <div className="w-full">
                    <input
                        type="text"
                        ref={inputRef}
                        name="text"
                        value={message.text}
                        onChange={handleChange}
                        placeholder="Type a message..."
                        className="w-full flex-1 px-1 py-2 bg-transparent border-b-2 placeholder:text-[#4b4b4b] border-gray-300 focus:outline-none focus:border-b-2 focus:border-blue-500 text-sm"
                    />
                </div>

                {/* Send Button */}
                <Button
                    title="send"
                    type="submit"
                    disabled={loading}
                    className="group"
                    btnText={
                        loading ? (
                            <div className="size-[20px] fill-[#4977ec] dark:text-[#ececec]">
                                {icons.loading}
                            </div>
                        ) : (
                            <div className="group-hover:stroke-[#4977ec] size-6 fill-none stroke-[#434343]">
                                {icons.send}
                            </div>
                        )
                    }
                />
            </form>
        </div>
    );
}
