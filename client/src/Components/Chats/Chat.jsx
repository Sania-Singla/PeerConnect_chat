import { useEffect, useState } from 'react';
import { useChatContext } from '../../Context';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../../Services';
import { Message } from '..';

export default function Chat() {
    const { setMessages, messages, selectedChat } = useChatContext();
    const [messagesInfo, setMessagesInfo] = useState({});
    const { chatId } = useParams();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // TODO: implement infinite scroll 
    useEffect(() => {
        if (selectedChat) {
            const controller = new AbortController();
            const signal = controller.signal;

            (async function getMessages() {
                try {
                    setLoading(true);
                    const data = await chatService.getMessages(
                        signal,
                        chatId,
                        page,
                        100
                    );
                    if (data && !data.message) {
                        setMessages(data.messages);
                        setMessagesInfo(data.messagesInfo);
                    }
                } catch (err) {
                    navigate('/server-error');
                } finally {
                    setLoading(false);
                }
            })();

            return () => {
                setMessages([]);
                controller.abort();
            };
        } else {
            setLoading(false);
        }
    }, [chatId]);

    const messageElements = messages.map((message) => (
        <Message message={message} key={message.message_id} />
    ));

    return (
        <div>
            {loading ? (
                <div>loading...</div>
            ) : messages.length > 0 ? (
                <div className="space-y-4">{messageElements}</div>
            ) : (
                <div>No messages</div>
            )}
        </div>
    );
}
