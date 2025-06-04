import { useQuestionContext } from '@/Context/QuestionContext';

export default function QuestionDiscuss() {
    // This would typically fetch discussions from an API
    const question = useQuestionContext();
    const discussions = question.discussions;

    return (
        <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
                Community Discussions
            </h3>

            <div className="space-y-4">
                {discussions.map((discussion) => (
                    <div
                        key={discussion.id}
                        className="border border-gray-200 rounded-lg p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                                {discussion.user}
                            </span>
                            <span className="text-sm text-gray-500">
                                {discussion.timestamp}
                            </span>
                        </div>
                        <p className="mb-2">{discussion.content}</p>
                        <div className="text-sm text-blue-600">
                            {discussion.replies}{' '}
                            {discussion.replies === 1 ? 'reply' : 'replies'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
