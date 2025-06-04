import { NavLink } from 'react-router-dom';
import { icons } from '@/Assets/icons';

export default function ProjectHeader() {
    const tabs = [
        {
            name: 'Description',
            to: '',
            icon: icons.details,
        },
        {
            name: 'Tasks',
            to: 'tasks',
            icon: icons.tasks,
        },
        {
            name: 'Contributors',
            to: 'contributors',
            icon: icons.group,
        },
        {
            name: 'Requests',
            to: 'requests',
            icon: icons.projects,
        },
        {
            name: 'Contribute',
            to: 'contribution-form',
            icon: icons.doc,
        },
    ];

    return (
        <nav className="bg-white flex justify-evenly overflow-scroll border-b border-gray-200 drop-shadow-sm rounded-lg mx-4 mb-4">
            {tabs.map((tab) => (
                <NavLink
                    end
                    key={tab.name}
                    to={tab.to}
                    className={({ isActive }) => `
                            ${isActive ? 'text-[#4977ec] border-b-2 border-[#4977ec]' : 'text-gray-600 hover:text-gray-700'}
                            flex items-center justify-center w-full mx-4 py-3 text-sm font-medium
                        `}
                >
                    <div className="flex items-center gap-2 text-nowrap">
                        <div className="size-4 fill-gray-600">{tab.icon}</div>
                        {tab.name}
                    </div>
                </NavLink>
            ))}
        </nav>
    );
}
