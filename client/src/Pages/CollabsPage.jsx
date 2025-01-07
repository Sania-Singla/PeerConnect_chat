import { useEffect } from 'react';
import { useUserContext, useChatContext } from '../Context';
import { ChatLayout } from '../Components';
import { useParams } from 'react-router-dom';

export default function CollabsPage() {
    const { user } = useUserContext();
    const { userId } = useParams;
    const { setSelectedChat } = useChatContext();

    useEffect(() => {
        setSelectedChat(null); // fetch the params user and set = that
    }, []);

    return user ? <ChatLayout /> : <div>Login to Collaborate with others</div>;
}
