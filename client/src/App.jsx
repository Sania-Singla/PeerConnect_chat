import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './Components';
import { useSideBarContext, useUserContext, usePopupContext } from './Context';
import { authService } from './Services';
import { icons } from './Assets/icons';

export default function App() {
    const { setUser } = useUserContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { setShowSideBar } = useSideBarContext();
    const { setLoginPopupText, setShowLoginPopup } = usePopupContext();

    useEffect(() => {
        (async function currentUser() {
            try {
                const data = await authService.getCurrentUser();
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
    }, []);

    // Close sidebar on window resize & location changes
    useEffect(() => {
        const handleResize = () => {
            setShowSideBar(false);
        };
        // on window resize
        window.addEventListener('resize', handleResize);

        // when location changes
        setShowSideBar(false);
        setLoginPopupText('');
        setShowLoginPopup(false);

        // cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [location]);

    return (
        <div className="bg-white h-screen w-screen">
            {loading ? (
                <div className="text-black h-full w-full flex flex-col items-center justify-center">
                    <div className="size-[33px] fill-[#4977ec] dark:text-[#ececec]">
                        {icons.loading}
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                        Please Wait...
                    </div>
                    <div className="text-[16px] mt-1">
                        Please refresh the page, if it takes too long
                    </div>
                </div>
            ) : (
                <Layout />
            )}
        </div>
    );
}
