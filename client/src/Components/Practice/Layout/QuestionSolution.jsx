import { useQuestionContext } from '@/Context/QuestionContext';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function QuestionSolutions() {
    const question = useQuestionContext();
    const { topicId, questionId } = useParams();
    const solutions = question.solutions || [];
    const [activeTab, setActiveTab] = useState(0);
    const [expandedSolutions, setExpandedSolutions] = useState({});
    const [copiedStates, setCopiedStates] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [voted, setVoted] = useState({});
    const solutionsPerPage = 3;

    // Filter solutions based on active tab
    const filteredSolutions =
        activeTab === 1
            ? [...solutions].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
            : solutions;

    // Pagination logic
    const indexOfLastSolution = currentPage * solutionsPerPage;
    const indexOfFirstSolution = indexOfLastSolution - solutionsPerPage;
    const currentSolutions = filteredSolutions.slice(
        indexOfFirstSolution,
        indexOfLastSolution
    );
    const totalPages = Math.ceil(filteredSolutions.length / solutionsPerPage);

    const toggleSolutionExpand = (index) => {
        setExpandedSolutions((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const copyToClipboard = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedStates((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => {
            setCopiedStates((prev) => ({ ...prev, [index]: false }));
        }, 2000);
    };

    const handleUpvote = (solutionId, e) => {
        e.stopPropagation();
        setVoted((prev) => ({
            ...prev,
            [solutionId]: !prev[solutionId],
        }));
        console.log(`Upvoted solution ${solutionId}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800">Solutions</h3>
                <div className="flex space-x-1">
                    <button
                        className={`px-3 py-1 text-sm rounded-md ${activeTab === 0 ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => {
                            setActiveTab(0);
                            setCurrentPage(1);
                        }}
                    >
                        All Solutions
                    </button>
                    <button
                        className={`px-3 py-1 text-sm rounded-md ${activeTab === 1 ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        onClick={() => {
                            setActiveTab(1);
                            setCurrentPage(1);
                        }}
                    >
                        Top Rated
                    </button>
                </div>
            </div>

            {/* Solutions List */}
            <div className="divide-y divide-gray-200">
                {currentSolutions.length > 0 ? (
                    currentSolutions.map((solution, i) => (
                        <div
                            key={solution.id}
                            className="p-4 hover:bg-gray-50 transition-colors"
                        >
                            {/* Solution Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {solution.language}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Runtime: {solution.runtime || 'N/A'} •
                                        Memory: {solution.memory || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="text-gray-400 hover:text-gray-600"
                                        onClick={() =>
                                            copyToClipboard(solution.code, i)
                                        }
                                        title="Copy code"
                                    >
                                        {copiedStates[i] ? (
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="text-green-500"
                                            >
                                                <path
                                                    d="M5 13L9 17L19 7"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <rect
                                                    x="9"
                                                    y="9"
                                                    width="13"
                                                    height="13"
                                                    rx="2"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                                <path
                                                    d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                    <button
                                        className={`flex items-center space-x-1 ${solution.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                                        onClick={(e) =>
                                            handleUpvote(solution.id, e)
                                        }
                                        title="Like this solution"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill={
                                                voted[solution.id]
                                                    ? 'black'
                                                    : 'none'
                                            }
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        <span className="text-xs">
                                            {solution.upvotes || 0}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Solution Explanation */}
                            <div
                                className={`prose prose-sm max-w-none ${!expandedSolutions[i] ? 'line-clamp-2' : ''}`}
                            >
                                <p className="text-gray-700">
                                    {solution.explanation}
                                </p>
                            </div>

                            {solution.explanation.length > 100 && (
                                <button
                                    className="text-blue-600 text-sm mt-2 hover:underline"
                                    onClick={() => toggleSolutionExpand(i)}
                                >
                                    {expandedSolutions[i]
                                        ? 'Show less'
                                        : 'Show more'}
                                </button>
                            )}

                            {/* Code Block */}
                            <div className="mt-4 rounded-md overflow-hidden border border-gray-200">
                                <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                                    <span className="text-xs font-mono text-gray-300">
                                        {solution.language}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-gray-300 hover:text-white"
                                            onClick={() =>
                                                copyToClipboard(
                                                    solution.code,
                                                    i
                                                )
                                            }
                                            title="Copy code"
                                        >
                                            {copiedStates[i] ? (
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    className="text-green-500"
                                                >
                                                    <path
                                                        d="M5 13L9 17L19 7"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                >
                                                    <rect
                                                        x="9"
                                                        y="9"
                                                        width="13"
                                                        height="13"
                                                        rx="2"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    />
                                                    <path
                                                        d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-100 text-sm">
                                    <code>{solution.code}</code>
                                </pre>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3 text-sm">
                                <div className="flex items-center space-x-3">
                                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                            />
                                        </svg>
                                        <span>Download</span>
                                    </button>
                                </div>
                                <span className="text-gray-500">
                                    Submitted
                                    {solution.timestamp || ' recently'}
                                </span>
                                <Link
                                    to={`/question/${topicId}/${questionId}/discuss`}
                                    className="text-blue-600 hover:underline"
                                >
                                    View Discussion
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No solutions found. Be the first to submit one!
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredSolutions.length > solutionsPerPage && (
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
                    <button
                        className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <div className="flex space-x-1">
                        {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                                // Show first pages, current page with neighbors, and last pages
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={i}
                                        className={`px-3 py-1 rounded-md text-sm ${currentPage === pageNum ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() =>
                                            handlePageChange(pageNum)
                                        }
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                        )}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="px-3 py-1 text-gray-500">...</span>
                        )}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <button
                                className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => handlePageChange(totalPages)}
                            >
                                {totalPages}
                            </button>
                        )}
                    </div>
                    <button
                        className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

// import { useQuestionContext } from '@/Context/QuestionContext'
// export default function QuestionSolutions() {
//     const question = useQuestionContext();
//     const solutions = question.solutions;

//     return (
//         <div className="bg-white p-4 rounded-lg">
//             <h3 className="text-lg font-semibold mb-4">Community Solutions</h3>

//             <div className="space-y-6">
//                 {solutions?.map((solution, i) => (
//                     <div
//                         key={i}
//                         className="border border-gray-200 rounded-lg overflow-hidden"
//                     >
//                         <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
//                             <span className="font-medium">
//                                 {solution.language}
//                             </span>
//                             <span className="text-sm text-gray-500 ml-2">
//                                 {solution.explanation}
//                             </span>
//                         </div>
//                         <pre className="p-4 overflow-x-auto bg-gray-900 text-gray-100">
//                             <code>{solution.code}</code>
//                         </pre>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
