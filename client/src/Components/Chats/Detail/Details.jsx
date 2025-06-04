import { NavLink, Outlet, useParams } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { useChatContext } from '@/Context';

export default function Details() {
    const { selectedChat } = useChatContext();
    const { chatId } = useParams();
    const options = [
        {
            name: 'Chat',
            path: `/chat/${chatId}`,
            icon: icons.chat,
            show: true,
        },
        {
            name: 'Members',
            path: 'members',
            icon: icons.group,
            show: selectedChat?.chat.isGroupChat,
        },
        {
            name: 'Settings',
            path: '',
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
                        `${isActive ? 'backdrop-brightness-95 border-b-[#4977ec]' : 'border-b-transparent'} w-full rounded-md px-3 py-2 border-b-[0.15rem] hover:backdrop-brightness-95 cursor-pointer flex items-center lg:justify-start justify-center gap-4`
                    }
                >
                    <div className="size-5 flex fill-gray-800 items-center justify-center">
                        {icon}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                </NavLink>
            )
    );

    return (
        <div className="flex h-full flex-col lg:flex-row overflow-scroll">
            <section className="border-b-[0.01rem] lg:border-b-0 lg:h-full w-full lg:w-1/3 lg:min-w-[150px] overflow-scroll lg:max-w-[200px] px-2 py-4 gap-2 border-r-[0.01rem] border-gray-200 flex flex-row items-center justify-evenly lg:justify-start lg:flex-col">
                {optionElements}
            </section>

            <section className="flex-1 h-full gap-2 overflow-y-scroll">
                <Outlet />
            </section>
        </div>
    );
}
