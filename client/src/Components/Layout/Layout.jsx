import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer, SmallSidebar, Sidebar, Popup } from '@/Components';
import { Toaster } from 'react-hot-toast';
import { useEffect, useRef } from 'react';

export default function Layout() {
    const { pathname } = useLocation();
    const layoutRef = useRef(null);
    const mainContentRef = useRef(null);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Scroll layout container
        if (layoutRef.current) {
            layoutRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Scroll main content area
        if (mainContentRef.current) {
            mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pathname]);

    return (
        <div className="h-screen w-full overflow-hidden" ref={layoutRef}>
            <Header />

            <div className="flex pt-[55px] h-full">
                <div className="hidden lg:block">
                    <Sidebar />
                </div>
                <div className="lg:hidden">
                    <SmallSidebar />
                </div>
                <main className="flex-1 overflow-auto" ref={mainContentRef}>
                    <div className="min-h-[calc(100vh-87px)] p-4">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
            <Popup />
            <Toaster />
        </div>
    );
}
