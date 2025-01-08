import { useUserContext } from '../../Context';

export default function Message({ message }) {
    const { user } = useUserContext();
    const { sender_id, text, attachment, message_createdAt } = message;

    return (
        <div
            className={`flex ${
                sender_id === user.user_id
                    ? 'justify-end pl-10'
                    : 'justify-start pr-10'
            }`}
        >
            {/* Message Bubble */}
            <div
                className={`max-w-[400px] w-fit px-4 py-2 rounded-lg shadow ${
                    sender_id === user.user_id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                }`}
            >
                {attachment && (
                    <div className="w-full aspect-[1.618] overflow-hidden rounded-lg mb-2">
                        <img
                            src={attachment}
                            alt="message attachment"
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <p className="text-sm">{text}</p>
                <p className="text-xs mt-1 text-gray-400">
                    {new Date(message_createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}
