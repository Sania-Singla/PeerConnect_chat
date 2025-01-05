import { useState } from 'react';
import { Button } from '../..';
import { icons } from '../../../Assets/icons';

export default function ChatInput({ onSendMessage }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="p-4 border-t border-gray-200 bg-white flex items-center space-x-3">
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

            {/* Attachment Icon */}
            <Button
                className="group"
                title="Attachment"
                btnText={
                    <div className="size-6 fill-none stroke-[#5f5f5f] hover:stroke-[#4977ec]">
                        {icons.link}
                    </div>
                }
            />

            {/* Input Field */}
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {/* Send Button */}
            <Button
                onClick={handleSend}
                title="send"
                className="group"
                btnText={
                    <div className="group-hover:stroke-[#4977ec] size-6 fill-none stroke-[#5f5f5f]">
                        {icons.send}
                    </div>
                }
            />
        </div>
    );
}
