import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSideBarContext, useUserContext } from '@/Context';
import { icons } from '@/Assets/icons';
import { Button, Logout } from '@/Components';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

export default function Sidebar() {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const { showSideBar, setShowSideBar } = useSideBarContext();
    const items = [
        { show: true, path: '/', name: 'Home', icon: icons.home },
        { show: true, path: '/liked', name: 'Liked Blogs', icon: icons.like },
        { show: true, path: '/saved', name: 'Saved Blogs', icon: icons.save },
        { show: user, path: '/admin', name: 'Admin', icon: icons.user },
        {
            show: user,
            path: '/chat',
            name: 'Collaborations',
            icon: icons.chat,
        },
        {
            show: user,
            path: '/followers',
            name: 'Followers',
            icon: icons.group,
        },
        {
            show: user,
            path: '/history',
            name: 'Watch History',
            icon: icons.clock,
        },
        {
            show: user,
            path: `/channel/${user?.user_id}`,
            name: 'My Content',
            icon: icons.image,
        },
    ];

    const systemItems = [
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
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-2 px-[10px] rounded-md hover:backdrop-brightness-90`
            }
            to={item.path}
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[17px] fill-[#2a2a2a]">{item.icon}</div>
                <div>{item.name}</div>
            </div>
        </NavLink>
    ));

    const systemItemElements = systemItems.map((item) => (
        <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-2 px-[10px] rounded-md hover:backdrop-brightness-90`
            }
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[17px] fill-[#202020]">{item.icon}</div>
                <div>{item.name}</div>
            </div>
        </NavLink>
    ));

    const sideBarRef = useRef();

    function closeSideBar(e) {
        if (e.target === sideBarRef.current) {
            setShowSideBar(false);
        }
    }

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
                    onClick={closeSideBar}
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
                        className="h-full w-[270px] flex justify-start"
                    >
                        <div className="w-full px-3 bg-[#f6f6f6] drop-shadow-md flex flex-col items-start justify-start h-full">
                            <div className="h-[60px] w-full flex items-center justify-between">
                                {/* hamburgur menu btn */}
                                <Button
                                    btnText={
                                        <div className="size-[18px] fill-[#434343] group-hover:fill-[#4977ec]">
                                            {icons.hamburgur}
                                        </div>
                                    }
                                    onClick={() =>
                                        setShowSideBar((prev) => !prev)
                                    }
                                    title="Close Sidebar"
                                    className="bg-[#ffffff] p-2 group rounded-full drop-shadow-md w-fit"
                                />
                                {user ? (
                                    <div className="w-full h-full py-3 flex items-center justify-end gap-3">
                                        <div
                                            onClick={() =>
                                                setShowSideBar(false)
                                            }
                                        >
                                            <Logout />
                                        </div>

                                        <Link
                                            to={`/channel/${user?.user_id}`}
                                            className="hover:scale-110 transition-all duration-300"
                                        >
                                            <div className="size-[34px] rounded-full overflow-hidden drop-shadow-sm hover:brightness-90">
                                                <img
                                                    src={user?.user_avatar}
                                                    alt="user avatar"
                                                    className="size-full object-cover border rounded-full"
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="w-full h-full py-3 flex items-center justify-end gap-3">
                                        <Button
                                            onClick={() =>
                                                navigate('/register')
                                            }
                                            btnText="Sign Up"
                                            className="text-white rounded-md py-[5px] w-[80px] bg-[#4977ec] hover:bg-[#3b62c2]"
                                        />

                                        <div className="h-full border-r-[0.01rem] border-[#c8c8c8]" />

                                        <Button
                                            onClick={() => navigate('/login')}
                                            btnText="Login"
                                            className="text-white rounded-md py-[5px] w-[80px] bg-[#4977ec] hover:bg-[#3b62c2]"
                                        />
                                    </div>
                                )}
                            </div>

                            <hr className="w-full my-0" />

                            <div className="overflow-y-scroll text-[17px] text-black w-full h-[calc(100%-60px)] py-3 flex flex-col items-start justify-between">
                                <div className="w-full flex flex-col gap-1 items-start justify-start">
                                    {itemElements}
                                </div>
                                <div className="w-full flex flex-col gap-1 items-start justify-start">
                                    <hr className="w-full" />
                                    {systemItemElements}
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
