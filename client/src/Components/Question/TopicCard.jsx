import { icons } from '@/Assets/icons';
import { Link } from 'react-router-dom';

const ProgressCircle = ({ percent, solved, total }) => {
    return (
        <div className="relative w-16 h-16">
            <svg viewBox="0 0 60 60" className="w-full h-full">
                <circle
                    cx="30"
                    cy="30"
                    r="24"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                />
                <circle
                    cx="30"
                    cy="30"
                    r="24"
                    stroke="#10b981"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(percent / 100) * 2 * Math.PI * 24} ${2 * Math.PI * 24}`}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                    className="transition-all duration-500 ease-in-out"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
                <span className="font-semibold">
                    {solved}/{total}
                </span>
                <span className="text-green-500">Solved</span>
            </div>
        </div>
    );
};

const DifficultyProgress = ({ difficulty, solved, total }) => {
    const colors = {
        easy: 'text-blue-600',
        medium: 'text-yellow-500',
        hard: 'text-red-500',
    };

    return (
        <div className="flex justify-between gap-3">
            <span className={`${colors[difficulty]} font-medium capitalize`}>
                {difficulty === 'med' ? 'Medium' : difficulty}
            </span>
            <span>
                {solved}/{total}
            </span>
        </div>
    );
};

export default function TopicCard({ topic }) {
    const {
        name,
        totalQuestions,
        saved,
        solved,
        easy,
        medium,
        hard,
        lastUpdated,
    } = topic;

    const percent = ((solved / totalQuestions) * 100).toFixed(1);

    return (
        <div className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 w-full max-w-md bg-white">
            <div className="flex gap-4 items-start">
                <div className="size-14 rounded-lg bg-blue-50 flex items-center justify-center p-3 text-blue-500">
                    {icons.code}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalQuestions} problems · {saved} saved
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                    Progress
                </h3>
                <div className="flex items-center gap-6">
                    <ProgressCircle
                        percent={percent}
                        solved={solved}
                        total={totalQuestions}
                    />

                    <div className="space-y-2 text-sm flex-1">
                        <DifficultyProgress difficulty="easy" {...easy} />
                        <DifficultyProgress difficulty="medium" {...medium} />
                        <DifficultyProgress difficulty="hard" {...hard} />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center gap-3">
                <button className="p-2 w-4 h-4 fill-black ">
                    {icons.save}
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    {icons.share}
                </button>
                <Link
                    to={'/questions'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Practice Now
                </Link>
            </div>
        </div>
    );
}
