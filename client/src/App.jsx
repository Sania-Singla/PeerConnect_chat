import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './Components';
import {
    useSideBarContext,
    useUserContext,
    usePopupContext,
    useSocketContext,
} from './Context';
import { authService } from './Services';
import { icons } from './Assets/icons';

export default function App() {
    const { setUser, user } = useUserContext();
    const { connectSocket, disconnectSocket } = useSocketContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { setShowSideBar } = useSideBarContext();
    const { setLoginPopupText, setShowLoginPopup } = usePopupContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function currentUser() {
            try {
                setLoading(true);
                const data = await authService.getCurrentUser(signal);
                if (data && !data.message) {
                    setUser(data);
                } else {
                    setUser(null);
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
    }, []);

    // socket setup
    useEffect(() => {
        user ? connectSocket() : disconnectSocket();
    }, [user]);

    // Close sidebar
    useEffect(() => {
        const handleResize = () => {
            setShowSideBar(false);
        };

        // on window resize
        window.addEventListener('resize', handleResize);

        // on location/route change
        setShowSideBar(false);
        setLoginPopupText('');
        setShowLoginPopup(false);

        // cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [location]);

    return (
        <div className="bg-white h-screen w-screen">
            {loading ? (
                <div className="text-black h-full w-full flex flex-col items-center justify-center">
                    <div className="size-[33px] fill-[#4977ec] dark:text-[#ececec]">
                        {icons.loading}
                    </div>
                    <p className="mt-2 text-2xl font-semibold">
                        Please Wait...
                    </p>
                    <p className="text-[16px] mt-1">
                        Please refresh the page, if it takes too long
                    </p>
                </div>
            ) : (
                <Layout />
            )}
        </div>
    );
}
