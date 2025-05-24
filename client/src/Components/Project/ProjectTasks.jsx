import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';

export default function ProjectTasks() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    // Mock data - replace with API calls
    const project = {
        projectId: projectId,
        title: 'AI-Powered Mental Health Chatbot',
        tasks: [
            {
                id: '1',
                title: 'Implement NLP emotion detection',
                description:
                    'Integrate sentiment analysis API for basic emotion detection',
                status: 'in-progress',
                priority: 'high',
                assignee: {
                    name: 'John Smith',
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                },
                created: '2023-10-20',
                updates: [
                    {
                        id: '1-1',
                        text: 'Started integration with IBM Watson API',
                        author: 'John Smith',
                        date: '2023-11-05',
                        type: 'progress',
                    },
                    {
                        id: '1-2',
                        text: 'Facing authentication issues with the API',
                        author: 'John Smith',
                        date: '2023-11-07',
                        type: 'blocker',
                    },
                ],
            },
            {
                id: '2',
                title: 'Design chat interface',
                description: 'Create responsive chat UI components',
                status: 'open',
                priority: 'medium',
                assignee: null,
                created: '2023-10-18',
                updates: [],
            },
            {
                id: '3',
                title: 'Setup database for user journals',
                description: 'MongoDB schema design for journal entries',
                status: 'completed',
                priority: 'medium',
                assignee: {
                    name: 'Sarah Williams',
                    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
                },
                created: '2023-10-15',
                updates: [
                    {
                        id: '3-1',
                        text: 'Completed initial schema design',
                        author: 'Sarah Williams',
                        date: '2023-10-25',
                        type: 'progress',
                    },
                    {
                        id: '3-2',
                        text: 'Approved by team lead',
                        author: 'Alex Johnson',
                        date: '2023-10-27',
                        type: 'comment',
                    },
                ],
            },
        ],
        contributors: [
            {
                name: 'John Smith',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            },
            {
                name: 'Alex Johnson',
                avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            },
            {
                name: 'Sarah Williams',
                avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
            },
        ],
    };

    const filteredTasks =
        activeFilter === 'all'
            ? project.tasks
            : project.tasks.filter((task) => task.status === activeFilter);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Task Management Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Task Board
                    </h1>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            // onClick={() =>
                            //     navigate(/project/${projectId}/tasks/new)
                            // }
                            btnText={
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 fill-white">
                                        {icons.plus}
                                    </div>
                                    <span>New Task</span>
                                </div>
                            }
                            className="bg-[#4977ec] hover:bg-[#3b62c2] text-white px-4 py-2 rounded-md"
                        />

                        <div className="flex border border-gray-200 rounded-md overflow-hidden">
                            {['all', 'open', 'in-progress', 'completed'].map(
                                (filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-3 py-1 text-sm font-medium ${
                                            activeFilter === filter
                                                ? 'bg-[#4977ec] text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {filter.split('-').join(' ')}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Task Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-blue-800 font-medium">
                            Total Tasks
                        </div>
                        <div className="text-2xl font-bold">
                            {project.tasks.length}
                        </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-green-800 font-medium">
                            Completed
                        </div>
                        <div className="text-2xl font-bold">
                            {
                                project.tasks.filter(
                                    (t) => t.status === 'completed'
                                ).length
                            }
                        </div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-yellow-800 font-medium">
                            In Progress
                        </div>
                        <div className="text-2xl font-bold">
                            {
                                project.tasks.filter(
                                    (t) => t.status === 'in-progress'
                                ).length
                            }
                        </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-red-800 font-medium">Open</div>
                        <div className="text-2xl font-bold">
                            {
                                project.tasks.filter((t) => t.status === 'open')
                                    .length
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {task.title}
                                        </h2>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                task.priority === 'high'
                                                    ? 'bg-red-100 text-red-800'
                                                    : task.priority === 'medium'
                                                      ? 'bg-yellow-100 text-yellow-800'
                                                      : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">
                                        {task.description}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    {task.assignee ? (
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={task.assignee.avatar}
                                                alt={task.assignee.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <span className="text-sm">
                                                {task.assignee.name}
                                            </span>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                handleClaimTask(task.id)
                                            }
                                            btnText="Claim Task"
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded-md"
                                        />
                                    )}
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            task.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : task.status === 'in-progress'
                                                  ? 'bg-blue-100 text-blue-800'
                                                  : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                </div>
                            </div>

                            {/* Task Updates */}
                            {task.updates.length > 0 && (
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Updates
                                    </h3>
                                    <div className="space-y-3">
                                        {task.updates.map((update) => (
                                            <div
                                                key={update.id}
                                                className={`p-3 rounded-lg ${
                                                    update.type === 'blocker'
                                                        ? 'bg-red-50 border-l-4 border-red-500'
                                                        : update.type ===
                                                            'progress'
                                                          ? 'bg-blue-50 border-l-4 border-blue-500'
                                                          : 'bg-gray-50 border-l-4 border-gray-300'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-sm">
                                                        {update.author}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {update.date}
                                                    </span>
                                                </div>
                                                <p className="text-sm">
                                                    {update.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add Update Button */}
                            <div className="mt-4 flex justify-end">
                                <Button
                                    onClick={() => handleAddUpdate(task.id)}
                                    btnText={
                                        <div className="flex items-center gap-1">
                                            {icons.comment}
                                            <span>Add Update</span>
                                        </div>
                                    }
                                    className="text-[#4977ec] hover:text-[#3b62c2] text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
