import { Outlet } from 'react-router-dom';
import { Header, Footer, SmallSidebar, Sidebar, Popup } from '@/Components';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    return (
        <div className="h-screen w-full">
            <Header />

            <div className="flex pt-[55px] h-full border-b-[0.09rem] border-[#e0e0e0]">
                <div className="hidden lg:block">
                    <Sidebar />
                </div>
                <div className="lg:hidden">
                    <SmallSidebar />
                </div>
                <main className="flex-1 overflow-auto">
                    <Outlet />
                    <Footer />
                </main>
            </div>
            <Popup />
            <Toaster />
        </div>
    );
}
