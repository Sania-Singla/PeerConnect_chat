import { useUserContext } from '../Context';
import { ChatLayout } from '../Components';

export default function CollabsPage() {
    const { user } = useUserContext();

    return user ? <ChatLayout /> : <div>Login to Collaborate with others</div>;
}
