import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useChatContext, usePopupContext, useSideBarContext } from '@/Context';
import { LOGO } from '@/Constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import { requestService } from '@/Services';
import { useEffect } from 'react';

export default function ChatNavbar() {
    const { setShowSideBar } = useSideBarContext();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const { requests, setRequests } = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getRequests() {
            try {
                const data = await requestService.getMyRequests(signal);
                setRequests(data);
            } catch (err) {
                navigate('/server-error');
            }
        })();

        return () => controller.abort();
    }, []);
    return (
        <header className="fixed top-0 z-[1] w-full bg-[#f6f6f6] border-b-[0.09rem] border-[#e0e0e0] text-black h-[55px] px-4 font-medium flex items-center justify-between gap-4">
            <div className="flex items-center justify-center gap-4">
                {/* hamburgur menu btn */}
                <Button
                    btnText={
                        <div className="size-[18px] group-hover:fill-[#4977ec] fill-[#2b2b2b]">
                            {icons.hamburgur}
                        </div>
                    }
                    title="Show Sidebar"
                    onClick={() => setShowSideBar((prev) => !prev)}
                    className="group cursor-pointer"
                />

                {/* logo */}
                <Link
                    to={'/'}
                    className="flex items-center justify-center gap-3 font-medium text-[17px]"
                >
                    <div className="overflow-hidden size-[34px]">
                        <img
                            src={LOGO}
                            alt="peer connect logo"
                            className="object-cover rounded-full hover:brightness-95 border-[0.09rem] border-[#e0e0e0]"
                        />
                    </div>
                    <div className="hidden sm:block hover:text-[#4977ec] transition-all duration-200">
                        PeerConnect
                    </div>
                </Link>
            </div>

            <div className="flex items-center justify-center gap-5 lg:gap-7">
                <div
                    className="group relative flex flex-col items-center gap-[3px] cursor-pointer justify-center"
                    onClick={() => {
                        setShowPopup(true);
                        setPopupInfo({ type: 'requests' });
                    }}
                >
                    <Button
                        btnText={
                            <div className="size-[14px] group-hover:fill-[#4977ec] fill-[#2b2b2b]">
                                {icons.bell}
                            </div>
                        }
                        title="Requests"
                        className="flex items-center justify-center"
                    />
                    <p className="text-xs group-hover:text-[#4977ec] font-normal text-[#2b2b2b]">
                        Requests
                    </p>

                    {requests.length > 0 && (
                        <div className="absolute -top-1 right-3 bg-[#4977ec] rounded-full size-2" />
                    )}
                </div>
                <div
                    onClick={() => {
                        setShowPopup(true);
                        setPopupInfo({ type: 'friends' });
                    }}
                    className="group flex flex-col items-center gap-[3px] cursor-pointer justify-center"
                >
                    <Button
                        btnText={
                            <div className="size-[14px] group-hover:fill-[#4977ec] fill-[#2b2b2b]">
                                {icons.group}
                            </div>
                        }
                        title="Connections"
                        className="flex items-center justify-center group"
                    />
                    <p className="text-xs group-hover:text-[#4977ec] font-normal text-[#2b2b2b]">
                        Connections
                    </p>
                </div>
            </div>
        </header>
    );
}
