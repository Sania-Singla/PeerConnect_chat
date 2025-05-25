import { useState } from 'react';
import { icons } from '@/Assets/icons';
import { Link } from 'react-router-dom';
import { Button } from '..';

export default function QuestionCard({ question }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const difficultyColors = {
        hard: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        easy: 'bg-green-100 text-green-800',
    };

    return (
        <div
            className={`border rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${isExpanded ? 'bg-gray-50' : 'bg-white'}`}
        >
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold truncate">
                                {question.title}
                            </h3>
                            {question.solved && (
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        Solved
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {question.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                            <span
                                className={`text-xs px-2 py-[4px] rounded-full ${difficultyColors[question.difficulty]}`}
                            >
                                {question.difficulty}
                            </span>
                            {question.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col h-full items-end gap-8 ml-2">
                        <Link
                            to={question.leetcodeLink}
                            target="_blank"
                            className="w-5 h-5 text-gray-400 hover:text-yellow-500 transition-colors"
                            title="Open in LeetCode"
                        >
                            {icons.leetcode}
                        </Link>
                        {!question.solved ? (
                            <Button
                                className="text-white rounded-md px-[10px] py-[4px] h-[35px] bg-[#4977ec] hover:bg-[#3b62c2] transition-colors text-sm"
                                btnText="Solve"
                            />
                        ) : (
                            <Button
                                className="text-white rounded-md px-[10px] py-[4px] h-[35px] bg-[#4977ec] hover:bg-[#3b62c2] transition-colors text-sm"
                                btnText="Solve Again"
                            />
                        )}
                    </div>
                </div>

                {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                            {question.detailedDescription}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                            <p>Companies: {question.companies.join(', ')}</p>
                            <p>Frequency: {question.frequency}</p>
                            <p>Acceptance: {question.acceptanceRate}%</p>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-2 bg-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
                {isExpanded ? 'Show Less' : 'Show More'}
            </button>
        </div>
    );
}
