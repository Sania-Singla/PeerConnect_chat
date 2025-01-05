import { useEffect, useState } from 'react';
import { useUserContext } from '../Context';
import { ChatLayout } from '../Components';
import { useChatContext } from '../Context';

export default function CollabsPage() {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(true);
    const { setSelectedChat } = useChatContext();
    
    useEffect(() => {
        setSelectedChat(null);
    }, []);

    if (!user) {
        return <div>Login to Collaborate with others</div>;
    }

    return loading ? (
        <div className="fixed top-[60px] inset-0">
            <ChatLayout />
        </div>
    ) : (
        <div>CollabsPage</div>
    );
}
