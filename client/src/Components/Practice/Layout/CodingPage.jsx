import { useState } from 'react';
import QuestionEditor from './QuestionEditor';
import QuestionDetail from './QuestionEditor';
import { Resizable } from 're-resizable';
import { useParams } from 'react-router-dom';
import { questionsByTopics } from '@/DummyData/questions';

export default function CodingPage() {
    const { topicId, questionId } = useParams();

    const question = questionsByTopics[topicId].find(
        (q) => q.questionId === questionId
    );

    const [width, setWidth] = useState(500);

    return (
        <div className="flex h-full bg-[#f5f5f5]">
            <Resizable
                size={{ width, height: '100%' }}
                minWidth={300}
                maxWidth={800}
                enable={{ right: true }}
                onResizeStop={(e, direction, ref, d) => {
                    setWidth(width + d.width);
                }}
            >
                <QuestionDetail question={question} />
            </Resizable>
            <div className="flex-1 min-w-[400px]">
                <QuestionEditor question={question} />
            </div>
        </div>
    );
}
