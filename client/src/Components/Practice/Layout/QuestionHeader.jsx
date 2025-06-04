import { NavLink } from 'react-router-dom';
import { icons } from '@/Assets/icons';

export default function QuestionHeader() {
    const tabs = [
        {
            name: 'Description',
            to: ``,
            icon: icons.description,
        },
        {
            name: 'Editorial',
            to: `editorial`,
            icon: icons.editorial,
        },
        {
            name: 'Solutions',
            to: `solutions`,
            icon: icons.solution,
        },
        {
            name: 'Submissions',
            to: `submissions`,
            icon: icons.submission,
        },
        {
            name: 'Discuss',
            to: `discuss`,
            icon: icons.discuss,
        },
    ];

    return (
        <nav className="shadow-sm bg-white border-b rounded-lg border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 rounded-lg max-w-screen-xl mx-auto w-full flex overflow-x-scroll gap-6">
                {tabs.map((tab) => (
                    <NavLink
                        end
                        key={tab.name}
                        to={tab.to}
                        className={({ isActive }) => `
                            flex items-center hover:border-b-[#4977ec] gap-2 whitespace-nowrap py-3 text-sm font-medium border-b-2
                            ${isActive ? 'text-[#4977ec]  border-[#4977ec]' : 'text-gray-600 border-transparent hover:text-gray-700'}
                        `}
                    >
                        <div className="size-4">{tab.icon}</div>
                        {tab.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
