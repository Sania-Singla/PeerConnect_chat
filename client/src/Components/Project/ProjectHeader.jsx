import { NavLink } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { useUserContext } from '@/Context';

export default function ProjectHeader() {
    const { user } = useUserContext();

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
        user
            ? {
                  name: 'Contribution Requests',
                  to: 'requests',
                  icon: icons.hi,
              }
            : {
                  name: 'Contribution Form',
                  to: 'contribution-form',
                  icon: icons.hlo,
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
                            ${isActive ? 'text-[#4977ec] border-b-2 border-[#4977ec]' : 'text-gray-600 hover:text-gray-700'}
                            flex items-center justify-center w-[180px] px-4 py-3 text-sm font-medium
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 fill-gray-600">
                                {tab.icon}
                            </div>
                            {tab.name}
                        </div>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
