import { useEffect, useState } from 'react';
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

    useEffect(() => {
        const chat = chats?.find((chat) => chat.chat_id === chatId);
        setSelectedChat(chat);
    }, [chats, chatId]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getMessages() {
            try {
                setLoading(true);
                // const res = await chatService.getMessages(signal, chatId);
                const res = [
                    {
                        sender_id: 'user123',
                        text: 'Hey, how are you doing?',
                        attachment: null,
                        message_createdAt: '2025-01-08T14:30:00Z',
                    },
                    {
                        sender_id: 'user123',
                        text: 'Doing well! Just been busy with work.',
                        attachment: null,
                        message_createdAt: '2025-01-08T14:34:00Z',
                    },
                    {
                        sender_id: 'ec6fc297-1687-4689-b80c-e17300a4f7ce',
                        text: 'weekend?',
                        attachment:
                            'https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature_thumb.jpg?sfvrsn=7abe71fe_4',
                        message_createdAt: '2025-01-08T14:35:00Z',
                    },
                    {
                        sender_id: 'user123',
                        text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Provident earum soluta labore perspiciatis, tempore recusandae inventore quibusdam, accusantium nobis debitis amet aliquam doloremque, assumenda corporis reiciendis fuga incidunt ullam tenetur!Ducimus vero alias illum dicta deserunt cumque similique, doloribus inventore a. Eaque tenetur quibusdam placeat illum enim odio necessitatibus voluptas commodi. Incidunt expedita debitis quas nulla et in minima quibusdam?Natus vitae et quasi quaerat harum quisquam distinctio maiores, repellendus ducimus eos sit deleniti esse consequuntur ab aperiam quam magni impedit minus dolorem unde. Accusamus incidunt facere iusto sapiente consectetur.Aut, deserunt ducimus blanditiis nobis dolore aliquam nisi eaque perspiciatis quibusdam sequi amet minus quisquam reiciendis similique, totam autem debitis obcaecati impedit quidem culpa sapiente, itaque rerum. Architecto, harum reprehenderit?',
                        attachment:
                            'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQx3xYZ8ECf4UKckANTqcdzF2Pbv3W1K6g-MQ9oI5-R9N4X4mXyZvxuUyx6neu0zZHjfZ2lceHJGzBn8O-PDdLMAg',
                        message_createdAt: '2025-01-08T14:36:00Z',
                    },
                ];
                if (res && !res.message) {
                    setMessages(res);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [chatId]);

    if (loading || !selectedChat) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#f6f6f6]">
                <div className="size-[33px] fill-[#4977ec] dark:text-[#ececec]">
                    {icons.loading}
                </div>
            </div>
        );
    }

    const currentUser = { id: '1', name: 'Alice' }; // Replace this with the actual current user

    const messageElements = messages?.map((message, index) => (
        <Message message={message} key={index} />
    ));

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messageElements}
            </div>

            <div className="px-4 py-2">
                <p className="text-gray-500 text-sm italic">
                    'User is typing...'
                </p>
            </div>

            <ChatInput />
        </div>
    );
}
