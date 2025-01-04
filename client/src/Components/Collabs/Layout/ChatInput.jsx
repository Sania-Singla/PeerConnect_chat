import { useState } from 'react';

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
            {/* Attachment Icon */}
            <button className="text-gray-500 hover:text-blue-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75V5.25a3.75 3.75 0 10-7.5 0v10.5a2.25 2.25 0 104.5 0V6.75"
                    />
                </svg>
            </button>

            {/* Input Field */}
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            {/* Send Button */}
            <button
                onClick={handleSend}
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 12l-7.5-7.5m7.5 7.5L12 4.5m7.5 7.5l-7.5 7.5m7.5-7.5H4.5"
                    />
                </svg>
            </button>
        </div>
    );
}
