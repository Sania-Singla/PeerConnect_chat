import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSideBarContext, useUserContext } from '@/Context';
import { icons } from '@/Assets/icons';
import { Button, Logout } from '..';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

export default function Sidebar() {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const { setShowSideBar, showSideBar } = useSideBarContext();
    const sideBarRef = useRef();

    const items = [
        { show: true, path: '/', name: 'Home', icon: icons.home },

        {
            show: true,
            path: '/resume',
            name: 'Build Resume',
            icon: icons.resume,
        },
        {
            show: true,
            path: '/interview',
            name: 'Mock Interview',
            icon: icons.interview,
        },
        {
            show: true,
            path: '/projects',
            name: 'Projects',
            icon: icons.projects,
        },
        {
            show: true,
            path: '/practice',
            name: 'Practice DSA',
            icon: icons.practice,
        },
        {
            show: true,
            path: '/bot',
            name: 'Query Bot',
            icon: icons.robot,
        },
        {
            show: true,
            path: '/chat',
            name: 'Messaging',
            icon: icons.chat,
        },
        // { show: user, path: '/dashboard', name: 'Dashboard', icon: icons.user },
        {
            show: true,
            path: '/editor',
            name: 'Text Editor',
            icon: icons.code,
        },
    ];

    const systemItems = [
        { show: true, path: '/faqs', name: 'FAQs', icon: icons.faq },
        { show: true, path: '/support', name: 'Support', icon: icons.support },
        { show: true, path: '/about-us', name: 'About Us', icon: icons.search },
        {
            show: true,
            path: '/contact-us',
            name: 'Contact Us',
            icon: icons.contact,
        },
        {
            show: user,
            path: '/settings',
            name: 'Settings',
            icon: icons.settings,
        },
    ];

    const itemElements = items.map((item) => (
        <NavLink
            key={item.name}
            className={({ isActive }) =>
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-[7px] px-[10px] rounded-md hover:backdrop-brightness-90`
            }
            to={item.path}
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[17px] fill-[#2b2b2b]">{item.icon}</div>
                <div>{item.name}</div>
            </div>
        </NavLink>
    ));

    const systemItemElements = systemItems.map((item) => (
        <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-[7px] px-[10px] rounded-md hover:backdrop-brightness-90`
            }
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[17px] fill-[#2b2b2b]">{item.icon}</div>
                <div>{item.name}</div>
            </div>
        </NavLink>
    ));

    const sideBarVariants = {
        beginning: {
            x: '-100vw',
        },
        end: {
            x: 0,
            transition: {
                type: 'tween',
                duration: 0.2,
            },
        },
        exit: {
            x: '-100vw',
            transition: {
                type: 'tween',
                duration: 0.2,
            },
        },
    };

    const backdropVariants = {
        visible: {
            backdropFilter: 'brightness(0.65)',
            transition: {
                duration: 0.2,
            },
        },
        hidden: {
            backdropFilter: 'brightness(1)',
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <AnimatePresence>
            {showSideBar && (
                <motion.div
                    ref={sideBarRef}
                    onClick={() => setShowSideBar(false)}
                    className="fixed inset-0 z-[1000]"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.aside
                        variants={sideBarVariants}
                        initial="beginning"
                        animate="end"
                        exit="exit"
                        className="fixed top-0 z-[1] h-full w-[250px] px-2 bg-[#f6f6f6] border-r-[0.09rem] border-[#e0e0e0]"
                    >
                        <div className="h-[55px] w-full flex items-center px-2 justify-between border-b-[0.09rem] border-[#e0e0e0]">
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

                            {user ? (
                                <div className="w-full h-full py-3 flex items-center justify-end gap-4">
                                    <div onClick={() => setShowSideBar(false)}>
                                        <Logout />
                                    </div>

                                    <Link to={`/channel/${user?.user_id}`}>
                                        <div className="size-[34px] rounded-full overflow-hidden">
                                            <img
                                                src={user?.user_avatar}
                                                alt="user avatar"
                                                className="size-full object-cover border-[0.09rem] border-[#e0e0e0] hover:brightness-90 rounded-full"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => navigate('/login')}
                                    btnText="Login"
                                    title="Login"
                                    className="text-white rounded-md w-[75px] h-[32px] bg-[#4977ec] hover:bg-[#3b62c2]"
                                />
                            )}
                        </div>

                        <div className="py-2 flex flex-col items-start justify-between overflow-auto h-[calc(100%-55px)]">
                            <div className="w-full flex flex-col gap-1 items-start justify-start">
                                {itemElements}
                            </div>

                            <div className="w-full flex border-t-[0.09rem] border-t-[#e0e0e0] pt-3 flex-col gap-1 items-start justify-start">
                                {systemItemElements}
                            </div>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
