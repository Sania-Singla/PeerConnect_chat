import { NavLink } from 'react-router-dom';
import { useUserContext } from '@/Context';
import { icons } from '@/Assets/icons';

export default function Sidebar() {
    const { user } = useUserContext();
    const items = [
        { show: true, path: '/', name: 'Home', icon: icons.home },
        {
            show: true,
            path: '/practice',
            name: 'Practice',
            icon: icons.practice,
        },
        {
            show: true,
            path: '/resume',
            name: 'Resume',
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
            path: '/bot',
            name: 'Query Bot',
            icon: icons.robot,
        },
        { show: user, path: '/dashboard', name: 'Dashboard', icon: icons.user },
        {
            show: true,
            path: '/editor',
            name: 'Text Editor',
            icon: icons.code,
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

    return (
        <aside className="h-full w-[250px] p-2 bg-[#f6f6f6] border-r-[0.09rem] border-[#e0e0e0] flex flex-col items-start justify-between overflow-auto">
            <div className="w-full flex flex-col gap-1 items-start justify-start">
                {itemElements}
            </div>
            <div className="w-full flex border-t-[0.09rem] border-t-[#e0e0e0] pt-3 flex-col gap-1 items-start justify-start">
                {systemItemElements}
            </div>
        </aside>
    );
}
