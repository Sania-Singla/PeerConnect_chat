import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatContext } from '../../Context';
import { ChatHeader, ChatInput, Message } from '..';
import { chatService } from '../../Services';
import { icons } from '../../Assets/icons';

export default function Chat() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { setSelectedChat, selectedChat, setMessages, messages, chats } =
        useChatContext();
    const [loading, setLoading] = useState(true);

    // Ref for scrolling
    const bottomRef = useRef(null);

    useEffect(() => {
        const chat = chats?.find((chat) => chat.chat_id === chatId);
        if (chats) {
            if (!chat) {
                navigate('/not-found');
            } else {
                setSelectedChat(chat);
            }
        }
    }, [chats, chatId]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getMessages() {
            try {
                setLoading(true);
                const res = await chatService.getMessages(signal, chatId);
                if (res && !res.message) {
                    setMessages(res);
                } else if (res?.message === 'no messages found') {
                    setMessages([]);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
            setMessages(null); // taki dusri chat k messages hi na dikhne lg jaye
            setSelectedChat(null);
        };
    }, [chatId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading || !selectedChat) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#f6f6f6]">
                <div className="size-[33px] fill-[#4977ec] dark:text-[#ececec]">
                    {icons.loading}
                </div>
            </div>
        );
    }

    const messageElements = messages?.map((message, index) => (
        <Message message={message} key={index} />
    ));

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4">
                {!messages ? (
                    <div>loading messages...</div>
                ) : messages.length > 0 ? (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messageElements}
                        <div ref={bottomRef} /> {/* Invisible anchor */}
                    </div>
                ) : (
                    <div>No messages yet</div>
                )}
            </div>

            {/* <div className="px-4 py-2">
                <p className="text-gray-500 text-sm italic">
                    'User is typing...'
                </p>
            </div> */}

            <ChatInput />
        </div>
    );
}
