import { NavLink, Outlet } from 'react-router-dom';
import { icons } from '../../../Assets/icons';
import { useChatContext } from '../../../Context';

export default function Details() {
    const { selectedChat } = useChatContext();
    const options = [
        { name: 'Overview', path: '', icon: icons.details, show: true },
        {
            name: 'Members',
            path: 'members',
            icon: icons.group,
            show: selectedChat.isGroupChat,
        },
        {
            name: 'Settings',
            path: 'settings',
            icon: icons.settings,
            show: true,
        },
    ];

    const optionElements = options.map(
        ({ name, path, icon, show }) =>
            show && (
                <NavLink
                    key={name}
                    to={path}
                    end
                    className={({ isActive }) =>
                        `${isActive ? 'backdrop-brightness-95 border-b-[#4977ec]' : 'border-b-transparent'} rounded-md px-3 py-2 border-b-[0.1rem] hover:backdrop-brightness-95 cursor-pointer`
                    }
                >
                    <div className="flex hover:backdrop-brightness-95 gap-x-3 items-center ">
                        <div className="size-[16px] fill-black">{icon}</div>
                        <div className="">{name}</div>
                    </div>
                </NavLink>
            )
    );

    return (
        <div className="flex">
            <section className="w-[200px] px-2 py-4 flex flex-col gap-1 border-r-[0.01rem]">
                {optionElements}
            </section>

            <section className="flex-1">
                <Outlet />
            </section>
        </div>
    );
}
