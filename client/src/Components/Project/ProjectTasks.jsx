import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useProjectContext } from '@/Context';

export default function ProjectTasks() {
    const project = useProjectContext();
    const initialTasks = project?.tasks || [];
    const [tasks, setTasks] = useState(initialTasks);
    const [activeFilter, setActiveFilter] = useState('all');
    const [newTaskFormOpen, setNewTaskFormOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        title: '',
        description: '',
    });

    const [updateText, setUpdateText] = useState({});
    const [openUpdateBox, setOpenUpdateBox] = useState(null);

    const filteredTasks =
        activeFilter === 'all'
            ? tasks
            : tasks.filter((task) => task.status === activeFilter);

    const handleClaimTask = (taskId) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          assignee: {
                              name: project.owner.name,
                              avatar: project.owner.avatar,
                          },
                          status: 'in-progress',
                      }
                    : task
            )
        );
    };

    const handleAddUpdate = (taskId) => {
        setOpenUpdateBox((prev) => (prev === taskId ? null : taskId));
    };

    const handleSubmitUpdate = (taskId) => {
        const text = updateText[taskId]?.trim();
        if (!text) return;

        const newUpdate = {
            id: Date.now(),
            author: 'You',
            date: new Date().toLocaleDateString(),
            text,
            type: 'progress',
        };

        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId
                    ? { ...task, updates: [...task.updates, newUpdate] }
                    : task
            )
        );

        // Clear input and close box
        setUpdateText((prev) => ({ ...prev, [taskId]: '' }));
        setOpenUpdateBox(null);
    };

    return (
        <div className="max-w-8xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Task Board
                    </h1>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => setNewTaskFormOpen(true)}
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

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            label: 'Total Tasks',
                            color: 'blue',
                            count: tasks.length,
                        },
                        {
                            label: 'Completed',
                            color: 'green',
                            count: tasks.filter((t) => t.status === 'completed')
                                .length,
                        },
                        {
                            label: 'In Progress',
                            color: 'yellow',
                            count: tasks.filter(
                                (t) => t.status === 'in-progress'
                            ).length,
                        },
                        {
                            label: 'Open',
                            color: 'red',
                            count: tasks.filter((t) => t.status === 'open')
                                .length,
                        },
                    ].map(({ label, color, count }) => (
                        <div
                            key={label}
                            className={`bg-${color}-100 p-3 rounded-lg`}
                        >
                            <div className={`text-${color}-800 font-medium`}>
                                {label}
                            </div>
                            <div className="text-2xl font-bold">{count}</div>
                        </div>
                    ))}
                </div>
            </div>
            {newTaskFormOpen && (
                <div className="mb-6 p-4 bg-white rounded-md shadow">
                    <h2 className="text-lg font-semibold mb-2">
                        Create New Task
                    </h2>
                    <input
                        type="text"
                        placeholder="Task title"
                        className="w-full mb-2 p-2 border rounded text-sm"
                        value={newTaskData.title}
                        onChange={(e) =>
                            setNewTaskData((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                    <textarea
                        placeholder="Task description"
                        className="w-full mb-2 p-2 border rounded text-sm"
                        rows="3"
                        value={newTaskData.description}
                        onChange={(e) =>
                            setNewTaskData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                    <div className="flex gap-2">
                        <Button
                            btnText="Add Task"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm rounded-md"
                            onClick={() => {
                                if (!newTaskData.title.trim()) return;

                                const newTask = {
                                    id: Date.now(),
                                    title: newTaskData.title.trim(),
                                    description: newTaskData.description.trim(),
                                    priority: 'low',
                                    status: 'open',
                                    assignee: null,
                                    updates: [],
                                };

                                setTasks((prev) => [...prev, newTask]);
                                setNewTaskFormOpen(false);
                                setNewTaskData({ title: '', description: '' });
                            }}
                        />
                        <Button
                            btnText="Cancel"
                            className="text-sm px-4 py-1"
                            onClick={() => setNewTaskFormOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Task Cards */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center text-gray-500 font-medium p-6 bg-white rounded-md shadow">
                        No such tasks available.
                    </div>
                ) : (
                    filteredTasks.map((task) => (
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
                                                        : task.priority ===
                                                            'medium'
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
                                        {task.status === 'completed' ? (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                                Completed
                                            </span>
                                        ) : (
                                            <select
                                                value={task.status}
                                                onChange={(e) => {
                                                    const newStatus =
                                                        e.target.value;
                                                    setTasks((prevTasks) =>
                                                        prevTasks.map((t) =>
                                                            t.id === task.id
                                                                ? {
                                                                      ...t,
                                                                      status: newStatus,
                                                                  }
                                                                : t
                                                        )
                                                    );
                                                }}
                                                className="text-xs px-2 py-1 rounded-md border text-gray-800 bg-white"
                                            >
                                                <option value="in-progress">
                                                    In Progress
                                                </option>
                                                <option value="completed">
                                                    Completed
                                                </option>
                                            </select>
                                        )}
                                    </div>
                                </div>

                                {/* Updates */}
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
                                                        update.type ===
                                                        'blocker'
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

                                {/* Add Update */}
                                <div className="mt-4 flex flex-col items-end gap-2">
                                    {openUpdateBox === task.id && (
                                        <div className="w-full mb-2">
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                rows="3"
                                                placeholder="Write your update..."
                                                value={
                                                    updateText[task.id] || ''
                                                }
                                                onChange={(e) =>
                                                    setUpdateText((prev) => ({
                                                        ...prev,
                                                        [task.id]:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                            <div className="flex justify-end mt-2">
                                                <Button
                                                    onClick={() =>
                                                        handleSubmitUpdate(
                                                            task.id
                                                        )
                                                    }
                                                    btnText="Post Update"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
                                                />
                                            </div>
                                        </div>
                                    )}
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
                    ))
                )}
            </div>
        </div>
    );
}
