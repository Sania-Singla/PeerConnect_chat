import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatContext } from '../../Context';
import { ChatHeader, ChatInput, Message } from '..';
import { chatService } from '../../Services';
import { icons } from '../../Assets/icons';
import { paginate } from '../../Utils';

export default function Chat() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { setSelectedChat, selectedChat, setMessages, messages, chats } =
        useChatContext();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [messagesInfo, setMessagesInfo] = useState({});
    // Create ref for the messages container
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // pagination
    // const paginateRef = paginate(messagesInfo?.hasNextPage, loading, setPage);

    // Auto-scroll to the bottom after fetching the first batch
    // useEffect(() => {
    //     if (messages.length > 0 && messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, [messages]);

    // Handle scroll to the top to trigger pagination
    const handleScroll = () => {
        if (
            messagesContainerRef.current &&
            messagesContainerRef.current.scrollTop === 0 &&
            !loading &&
            messagesInfo?.hasNextPage
        ) {
            console.log('page updated');
            setPage((prev) => prev + 1);
        }
    };

    // select chat
    useEffect(() => {
        if (chats) {
            const chat = chats?.find((chat) => chat.chat_id === chatId);
            chat ? setSelectedChat(chat) : navigate('/not-found');
        }
    }, [chats, chatId]);

    // fetch messages
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getMessages() {
            try {
                console.log(page);
                setLoading(true);
                const res = await chatService.getMessages(signal, chatId);
                if (res && !res.message) {
                    setMessages((prev) => [...res.messages.reverse(), ...prev]); // append on top
                    setMessagesInfo(res.messagesInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
            setMessages([]); // Clear messages when the chatId changes because they are a context state not local
            // setSelectedChat(null);
        };
    }, [chatId, page]);

    const messageElements = messages.map((message, index) => (
        <Message
            message={message}
            key={message.message_id}
            // reference={
            //     index === 0 && messagesInfo?.hasNextPage ? paginateRef : null
            // }
        />
    ));

    if (!selectedChat) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#f6f6f6]">
                <div className="size-[33px] fill-[#4977ec] dark:text-[#ececec]">
                    {icons.loading}
                </div>
            </div>
        );
    } else
        return (
            <div className="flex flex-col h-full bg-gray-50">
                <ChatHeader />

                {loading ? (
                    page === 1 ? ( //skeleton
                        <div className="w-full text-center">
                            loading messages...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center my-2 w-full">
                            <div className="size-7 fill-[#4977ec] dark:text-[#f7f7f7]">
                                {icons.loading}
                            </div>
                        </div>
                    )
                ) : (
                    messages.length < 0 && <div>No messages yet</div>
                )}

                {messages.length > 0 && (
                    <div
                        ref={messagesContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                        onScroll={handleScroll}
                    >
                        {messageElements}

                        {selectedChat?.isTyping && (
                            <p className="px-4 py-2 text-gray-500 text-sm italic">
                                User is typing...
                            </p>
                        )}

                        {/* Reference to scroll to the bottom */}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                <ChatInput />
            </div>
        );
}
