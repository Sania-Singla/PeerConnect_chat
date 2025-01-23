import { NavLink, Outlet } from 'react-router-dom';
import { icons } from '../../Assets/icons';

export default function Details() {
    const options = [
        { name: 'Overview', path: '', icon: icons.details },
        { name: 'Members', path: 'members', icon: icons.group },
        { name: 'Settings', path: 'settings', icon: icons.settings },
    ];

    const optionElements = options.map(({ name, path, icon }) => (
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
    ));

    return (
        <div className="flex bg-[#f6f6f6] h-full fixed inset-0 z-1 ml-[300px] mt-[120px]">
            <section className="w-[200px] px-2 py-4 flex flex-col gap-1 border-r-[0.01rem]">
                {optionElements}
            </section>

            <section className="flex-1">
                <Outlet />
            </section>
        </div>
    );
}
