import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChatContext } from '../../Context';

export default function Chat() {
    const { colabId } = useParams();
    const { selectedChat, setSelectedChat } = useChatContext();

    useEffect(() => {
        if (!selectedChat) {
            // fetch colab
            // setSelectedChat(colab);
        } else {
            setSelectedChat(colabId);
        }

        // fetch messages for this colabId
        // setMessages(messages);
    }, [colabId]);

    // example
    const messages = [
        { text: 'Hello!', senderId: '1', timestamp: '2023-01-04T10:00:00Z' },
        {
            text: 'Hi, how are you?',
            senderId: '2',
            timestamp: '2023-01-04T10:01:00Z',
        },
    ];

    const currentUser = { id: '1', name: 'Alice' };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.senderId === currentUser.id
                                ? 'justify-end'
                                : 'justify-start'
                        }`}
                    >
                        {/* Message Bubble */}
                        <div
                            className={`max-w-sm px-4 py-2 rounded-lg shadow ${
                                message.senderId === currentUser.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs mt-1 text-gray-400">
                                {new Date(message.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Typing Indicator */}
            <div className="px-4 py-2">
                <p className="text-gray-500 text-sm italic">
                    User is typing...
                </p>
            </div>
        </div>
    );
}
