import { useEffect } from 'react';
import { useUserContext, useChatContext } from '../Context';
import { ChatLayout } from '../Components';

export default function CollabsPage() {
    const { user } = useUserContext();
    const { setSelectedChat } = useChatContext();

    useEffect(() => {
        setSelectedChat(null);
    }, []);

    return user ? <ChatLayout /> : <div>Login to Collaborate with others</div>;
}
