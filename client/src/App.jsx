import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/Components';
import { useSideBarContext, useUserContext, usePopupContext } from '@/Context';
import { authService } from '@/Services';
import { icons } from '@/Assets/icons';

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

        // on location/route change
        setShowSideBar(false);
        setShowPopup(false);

        return () => window.removeEventListener('resize', handleResize);
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
