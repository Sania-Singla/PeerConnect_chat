import { NavLink } from 'react-router-dom';
import { icons } from '@/Assets/icons';

export default function ProjectHeader() {
    const tabs = [
        {
            name: 'Description',
            to: '',
            icon: icons.description,
        },
        {
            name: 'Tasks',
            to: 'tasks',
            icon: icons.tasks,
        },
        {
            name: 'Contributors',
            to: 'contributors',
            icon: icons.contributers,
        },
    ];

    return (
        <nav className="bg-white shadow-sm rounded-lg mx-4 mb-6">
            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                    <NavLink
                        end
                        key={tab.name}
                        to={tab.to}
                        className={({ isActive }) => `
                            ${isActive ? 'text-[#4977ec] border-b-2 border-[#4977ec]' : 'text-gray-500 hover:text-gray-700'}
                            flex items-center justify-center px-4 py-3 text-sm font-medium
                        `}
                    >
                        <div className="flex items-center gap-2">
                            {tab.icon}
                            {tab.name}
                        </div>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
