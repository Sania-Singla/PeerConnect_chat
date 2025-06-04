import { useState } from 'react';
import { Button, QuestionCard } from '@/Components';
import { useParams } from 'react-router-dom';
import { questionsByTopics } from '@/DummyData/questions.js';
import { topics } from '@/DummyData/topics';

export default function QuestionsPage() {
    const { topicId } = useParams();

    const topicQuestions = questionsByTopics[topicId] || [];

    const topic = topics.find((t) => t.id === topicId);

    const [filter, setFilter] = useState('all');

    const filteredQuestions = topicQuestions.filter((q) => {
        if (filter === 'all') return true;
        if (filter === 'solved') return q.solved;
        if (filter === 'unsolved') return !q.solved;
        return q.difficulty === filter;
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    {topic.name} Questions ({topicQuestions.length})
                </h1>

                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-[#4977ec] text-white' : 'bg-gray-200 text-gray-700'}`}
                        btnText="All"
                    />
                    <Button
                        onClick={() => setFilter('solved')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'solved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        btnText="Solved"
                    />
                    <Button
                        onClick={() => setFilter('unsolved')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'unsolved' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        btnText="Unsolved"
                    />
                    <Button
                        onClick={() => setFilter('easy')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        btnText="Easy"
                    />
                    <Button
                        onClick={() => setFilter('medium')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        btnText="Medium"
                    />
                    <Button
                        onClick={() => setFilter('hard')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        btnText="Hard"
                    />
                </div>
            </div>

            <div className="border-[0.09rem] border-gray-200 rounded-lg bg-white">
                {filteredQuestions.length
                    ? filteredQuestions.map((question) => (
                          <QuestionCard
                              key={question.questionId}
                              question={question}
                              topicId={topicId}
                          />
                      ))
                    : 'No such Questions there.'}
            </div>
        </div>
    );
}
