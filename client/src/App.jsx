import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/Components';
import { useSideBarContext, useUserContext, usePopupContext } from '@/Context';
import { authService } from '@/Services';

export default function App() {
    const { setUser } = useUserContext();
    const [loading, setLoading] = useState(true);
    const { setShowSideBar } = useSideBarContext();
    const { setShowPopup } = usePopupContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function currentUser() {
            try {
                setLoading(true);
                const data = await authService.getCurrentUser(signal);
                setUser(data && !data.message ? data : null);
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    // Close sidebar & popups
    useEffect(() => {
        const handleResize = () => setShowSideBar(false);

        // on window resize
        window.addEventListener('resize', handleResize);

        // on route change
        setShowSideBar(false);
        setShowPopup(false);

        return () => window.removeEventListener('resize', handleResize);
    }, [location]);

    return (
        <div className="bg-white h-screen w-screen">
            {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                    <img
                        src="images/logo.jpg"
                        alt="peer connect logo"
                        className="size-24 animate-pulse"
                    />
                </div>
            ) : (
                <Layout />
            )}
        </div>
    );
}
