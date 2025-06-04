import { Outlet, useParams } from 'react-router-dom';
import { QuestionHeader, QuestionEditor } from '@/Components';
import { questionsByTopics } from '@/DummyData/questions';
import { QuestionContext } from '@/Context/QuestionContext';

export default function QuestionLayout() {
    const { topicId, questionId } = useParams();

    const topicQuestions = questionsByTopics[topicId] || [];

    const question = topicQuestions.find((q) => q.questionId === questionId);

    return (
        <QuestionContext.Provider value={question}>
            <div className="flex flex-col md:flex-row w-full space-x-4 space-y-4">
                {/* Left Side: Question Content */}
                <div className="w-full md:w-1/2 flex flex-col h-[calc(100vh-90px)]">
                    <QuestionHeader />
                    <div className="shadow-sm rounded-lg flex-1 overflow-y-auto mt-4">
                        <Outlet />
                    </div>
                </div>

                {/* Right Side: Code Editor */}
                <div className="w-full md:w-1/2 min-h-[500px] h-[calc(100vh-90px)] flex-1 rounded-md shadow-md overflow-hidden">
                    <QuestionEditor />
                </div>
            </div>
        </QuestionContext.Provider>
    );
}
