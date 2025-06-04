import { useQuestionContext } from '@/Context/QuestionContext';

export default function QuestionDescription() {
    const question = useQuestionContext();

    const formattedAcceptanceRate = question.acceptanceRate.toFixed(1);

    return (
        <div className="bg-white p-6 rounded-lg">
            {/* Question Title */}
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-2xl font-semibold text-gray-800">
                    {question.title}
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                        Acceptance: {formattedAcceptanceRate}%
                    </span>
                    <span className="text-sm text-gray-600">
                        Frequency: {question.frequency}
                    </span>
                </div>
            </div>

            {/* Difficulty Badge */}
            <div
                className={`inline-block px-3 py-1 rounded-md text-sm font-medium mb-4 ${
                    question.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : question.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                }`}
            >
                {question.difficulty.charAt(0).toUpperCase() +
                    question.difficulty.slice(1)}
            </div>

            {/* Detailed Description with Markdown-like formatting */}
            <div className="prose max-w-none text-gray-800 mb-6">
                <div className="whitespace-pre-line space-y-4">
                    {question.detailedDescription
                        .split('\n')
                        .map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                </div>
            </div>

            {/* Examples Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Examples</h2>
                <div className="space-y-4">
                    {question.testCases.map((testCase, i) => (
                        <div
                            key={i}
                            className="bg-gray-50 p-4 rounded-md border border-gray-200"
                        >
                            <p className="font-medium text-gray-800 mb-2">
                                Example {i + 1}:
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                <div>
                                    <span className="text-gray-600 font-mono">
                                        Input: {testCase.input}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-600 font-mono">
                                        Output: {testCase.output}
                                    </span>
                                </div>
                                {testCase.explanation && (
                                    <div className="mt-2">
                                        <span className="text-gray-600">
                                            Explanation: {testCase.explanation}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Constraints Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Constraints</h2>
                <ul className="list-disc pl-5 space-y-2">
                    {question.constraints?.map((constraint, i) => (
                        <li key={i} className="text-gray-700">
                            <code className="bg-gray-100 px-1 rounded text-sm font-mono">
                                {constraint}
                            </code>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Follow up section if exists */}
            {question.followUp && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Follow up</h2>
                    <p className="text-gray-700">{question.followUp}</p>
                </div>
            )}

            {/* Tags Section */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">
                    Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Companies Section */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Companies</h3>
                <div className="flex flex-wrap gap-2">
                    {question.companies.map((company, i) => (
                        <span
                            key={i}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
                        >
                            {company}
                        </span>
                    ))}
                </div>
            </div>

            {/* Similar Questions Section */}
            {question.similarQuestions && (
                <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-2">
                        Similar Questions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {question.similarQuestions?.map((similar, i) => (
                            <a
                                key={i}
                                href="#"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                {similar.title} ({similar.difficulty})
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
