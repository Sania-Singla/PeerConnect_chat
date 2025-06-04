import { useSocketContext } from '@/Context';
import { Outlet } from 'react-router-dom';

export default function EditorPage() {
    const { socket } = useSocketContext();
    
    if (!socket) return <div>loading...</div>;

    return <Outlet />;
}
