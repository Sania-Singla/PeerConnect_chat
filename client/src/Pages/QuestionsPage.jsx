import { useState } from 'react';
import { QuestionCard } from '@/Components';
import { questions } from '@/DummyData/question';

export default function QuestionsPage() {
    const [filter, setFilter] = useState('all');

    const filteredQuestions = questions.filter((q) => {
        if (filter === 'all') return true;
        if (filter === 'solved') return q.solved;
        if (filter === 'unsolved') return !q.solved;
        return q.difficulty === filter;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    Coding Questions
                </h1>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('solved')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'solved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Solved
                    </button>
                    <button
                        onClick={() => setFilter('unsolved')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'unsolved' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Unsolved
                    </button>
                    <button
                        onClick={() => setFilter('easy')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Easy
                    </button>
                    <button
                        onClick={() => setFilter('medium')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Medium
                    </button>
                    <button
                        onClick={() => setFilter('hard')}
                        className={`px-3 py-1 rounded-full text-sm ${filter === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Hard
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.map((question) => (
                    <QuestionCard
                        key={question.questionId}
                        question={question}
                    />
                ))}
            </div>
        </div>
    );
}
