import { icons } from '@/Assets/icons';
import { Link } from 'react-router-dom';

const ProgressCircle = ({ percent, solved, total }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 60 60" className="w-full h-full">
                <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                />
                <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 30 30)"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex px-4 flex-col items-center justify-center text-[11px] font-medium text-gray-700">
                <span>{solved}</span>
                <span className="border-t border-gray-300 w-full text-center mt-1 pt-[1px]">
                    {total}
                </span>
            </div>
        </div>
    );
};

const DifficultyProgress = ({ difficulty, solved, total }) => {
    const colors = {
        easy: 'text-green-600',
        medium: 'text-yellow-500',
        hard: 'text-red-500',
    };

    return (
        <div className="flex justify-between items-center text-sm font-medium">
            <span className={`${colors[difficulty]} capitalize`}>
                {difficulty === 'med' ? 'Medium' : difficulty}
            </span>
            <span className="text-gray-600">
                {solved}/{total}
            </span>
        </div>
    );
};

export default function TopicCard({ topic }) {

    const {
        id,
        name,
        totalQuestions,
        saved,
        solved,
        easy,
        medium,
        hard,
        lastUpdated,
        icon,
    } = topic;


    const percent = ((solved / totalQuestions) * 100).toFixed(1);
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 p-6 w-full max-w-md">
            {/* Header */}
            <div className="flex gap-4 items-start">
                <img className="w-15 h-15 rounded-md p-3 border border-blue-100 flex items-center justify-center  text-blue-500"
                   src={icon} alt='icon'
                />

                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 leading-tight">
                        {name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalQuestions} problems • {saved} saved
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
                <h3 className="text-[15px] font-semibold text-gray-700 mb-3">
                    Your Progress
                </h3>
                <div className="flex items-center gap-5">
                    <ProgressCircle
                        percent={percent}
                        solved={solved}
                        total={totalQuestions}
                    />
                    <div className="flex-1 space-y-2">
                        <DifficultyProgress difficulty="easy" {...easy} />
                        <DifficultyProgress difficulty="medium" {...medium} />
                        <DifficultyProgress difficulty="hard" {...hard} />
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end">
                <Link
                    to={`/questions/${id}`}
                    className="bg-[#4977ec] hover:bg-[#3b62c2] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                    Practice Now
                </Link>
            </div>
        </div>
    );
}
