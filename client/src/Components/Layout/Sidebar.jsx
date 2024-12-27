import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSideBarContext, useUserContext } from '../../Context';
import { icons } from '../../Assets/icons';
import { Button, Logout } from '..';
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
        {
            show: user,
            path: '/followers',
            name: 'Followers',
            icon: icons.group,
        },
        { show: user, path: '/admin', name: 'Admin', icon: icons.user },
        {
            show: user,
            path: `/channel/${user?.user_name}`,
            name: 'My Content',
            icon: icons.image,
        },
    ];

    const systemItems = [
        { show: true, path: '/support', name: 'Support', icon: icons.support },
        {
            show: user,
            path: '/settings',
            name: 'Settings',
            icon: icons.settings,
        },
        { show: true, path: '/about-us', name: 'About Us', icon: icons.search },
        {
            show: true,
            path: '/contact-us',
            name: 'Contact Us',
            icon: icons.contact,
        },
    ];

    const itemElements = items.map((item) => (
        <NavLink
            key={item.name}
            className={({ isActive }) =>
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-2 px-3 rounded-md hover:backdrop-brightness-90`
            }
            to={item.path}
            onClick={() => setShowSideBar(false)}
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[20px]">{item.icon}</div>
                <div>{item.name}</div>
            </div>
        </NavLink>
    ));

    const systemItemElements = systemItems.map((item) => (
        <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setShowSideBar(false)}
            className={({ isActive }) =>
                `${isActive && 'backdrop-brightness-90'} ${!item.show && 'hidden'} w-full py-2 px-3 rounded-md hover:backdrop-brightness-90`
            }
        >
            <div className="flex items-center justify-start gap-4">
                <div className="size-[20px]">{item.icon}</div>
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
            },
        },
        exit: {
            x: '-100vw',
            transition: {
                type: 'tween',
            },
        },
    };

    return (
        <AnimatePresence>
            {showSideBar && (
                <motion.div
                    variants={sideBarVariants}
                    initial="beginning"
                    animate="end"
                    exit="exit"
                    ref={sideBarRef}
                    onClick={closeSideBar}
                    className="z-[10] h-full fixed inset-0 flex justify-start overflow-y-scroll"
                >
                    <div className="w-72 px-4 bg-[#f6f6f6] drop-shadow-md flex flex-col items-start justify-start h-full">
                        <div className="h-[60px] pl-2 gap-5 w-full flex items-center justify-between">
                            {/* hamburgur menu btn */}
                            <Button
                                btnText={
                                    <div className="size-[20px] fill-[#434343] group-hover:fill-[#4977ec]">
                                        {icons.hamburgur}
                                    </div>
                                }
                                onClick={() => {
                                    setShowSideBar((prev) => !prev);
                                }}
                                className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md w-fit"
                            />
                            {user ? (
                                <div className="w-full h-full py-3 flex items-center justify-end gap-4">
                                    <div onClick={() => setShowSideBar(false)}>
                                        <Logout />
                                    </div>

                                    <Link
                                        to={`/channel/${user?.user_name}`}
                                        onClick={() => setShowSideBar(false)}
                                    >
                                        <div className="size-[35px] rounded-full overflow-hidden drop-shadow-md hover:brightness-90">
                                            <img
                                                src={user?.user_avatar}
                                                alt="user avatar"
                                                className="size-full object-cover"
                                            />
                                        </div>
                                    </Link>
                                </div>
                            ) : (
                                <div className="w-full h-full py-3 flex items-center justify-end gap-2">
                                    <Button
                                        onClick={() => {
                                            navigate('/register');
                                            setShowSideBar(false);
                                        }}
                                        btnText="Sign Up"
                                        className="text-white rounded-md py-[5px] w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                                    />

                                    <div className="h-full border-r-[0.01rem] border-[#c8c8c8]" />

                                    <Button
                                        onClick={() => {
                                            navigate('/login');
                                            setShowSideBar(false);
                                        }}
                                        btnText="Login"
                                        className="text-white rounded-md py-[5px] w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                                    />
                                </div>
                            )}
                        </div>

                        <hr className="w-full" />

                        <div className="text-lg text-black w-full h-[calc(100%-60px)] py-6 flex flex-col items-start justify-between">
                            <div className="w-full flex flex-col gap-2 items-start justify-start">
                                {itemElements}
                            </div>
                            <div className="w-full flex flex-col gap-2 items-start justify-start">
                                <hr className="w-full" />
                                {systemItemElements}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
