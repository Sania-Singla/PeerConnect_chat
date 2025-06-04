import { Link, useNavigate } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { Button } from '..';

export default function QuestionCard({ question, topicId }) {
    const navigate = useNavigate();
    const links = {
        leetcode:
            'https://cdn.iconscout.com/icon/free/png-512/leetcode-3521542-2944960.png',
        gfg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/GeeksforGeeks.svg/1024px-GeeksforGeeks.svg.png',
        codeChef: 'https://pbs.twimg.com/media/EBvl9IXXUAAztHs.png',
        hackerrank:
            'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/160_Hackerrank_logo_logos-512.png',
    };
    const difficultyColors = {
        hard: {
            color: 'text-red-700',
            bg: 'bg-red-100',
            border: 'border-red-200',
        },
        medium: {
            color: 'text-yellow-700',
            bg: 'bg-yellow-100',
            border: 'border-yellow-200',
        },
        easy: {
            color: 'text-green-700',
            bg: 'bg-green-100',
            border: 'border-green-200',
        },
    };

    return (
        <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100">
            {/* Left side - Question title and solved indicator */}
            <div className="flex items-center gap-3 w-[60%]">
                {question.solved ? (
                    <span className="fill-green-500">
                        <div className="h-4 w-4">{icons.check}</div>
                    </span>
                ) : (
                    <div className="w-4" />
                )}
                <Link
                    to={`/question/${topicId}/${question.questionId}`}
                    className="text-sm font-medium text-gray-800 truncate hover:text-blue-600 transition-colors"
                    title={question.title}
                >
                    {question.title}
                </Link>
            </div>

            {/* Platfrm icon */}
            <Link
                to={question.platform.link}
                target="_blank"
                className="text-gray-400 hover:text-yellow-500 transition-colors w-[20%]"
                title="Open in LeetCode"
            >
                <img
                    className="w-5 h-5 object-contain"
                    src={
                        question.platform.name == 'leetcode'
                            ? links.leetcode
                            : question.platform.name == 'gfg'
                              ? links.gfg
                              : question.platform.name == 'codechef'
                                ? links.codeChef
                                : question.platform.name == 'hackerrank'
                                  ? links.hackerrank
                                  : ''
                    }
                    alt={question.platform.name}
                />
            </Link>

            {/* Right side - LeetCode link, difficulty, and action button */}
            <div className="flex items-center justify-end gap-4 w-[20%] ">
                {/* Difficulty badge */}
                <span
                    className={`text-xs font-medium ${difficultyColors[question.difficulty].bg} rounded-full px-3 border-[0.09rem] ${difficultyColors[question.difficulty].border} py-[3px] pb-[4px] ${difficultyColors[question.difficulty].color}`}
                >
                    {question.difficulty}
                </span>

                {/* Solve button */}
                <Button
                    onClick={() =>
                        navigate(`/question/${topicId}/${question.questionId}`)
                    }
                    className="text-white rounded-md px-3 h-7 text-xs bg-[#4977ec] hover:bg-blue-700 transition-colors"
                    btnText={'Solve'}
                />
            </div>
        </div>
    );
}
