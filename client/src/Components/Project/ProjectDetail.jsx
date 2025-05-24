import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';

export default function ProjectDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // dummy data
    const project = {
        projectId: projectId,
        title: 'AI-Powered Mental Health Chatbot',
        description:
            'A conversational AI assistant that provides mental health support, mood tracking, and connects users with professional help when needed. The system uses natural language processing to understand user emotions and provide appropriate responses.',
        longDescription: `
            <p>This project aims to bridge the gap in mental health accessibility by providing 24/7 support through an AI chatbot. Key features include:</p>
            <ul>
                <li>Real-time mood analysis through conversational patterns</li>
                <li>Journaling functionality with sentiment analysis</li>
                <li>Crisis detection and escalation to human professionals</li>
                <li>Personalized mental health resources</li>
                <li>Anonymous usage for user privacy</li>
            </ul>
            <p>The system is built using React for the frontend, Node.js for the backend, and integrates with several mental health APIs. We're currently working on improving the NLP models for better emotional understanding.</p>
        `,
        tags: [
            { name: 'mental health', color: '#E8EAF6' },
            { name: 'chatbot', color: '#E0F7FA' },
            { name: 'AI', color: '#F3E5F5' },
        ],
        githubLink: 'https://github.com/example/mental-health-chatbot',
        owner: {
            name: 'Jane Doe',
            avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        },
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
        createdAt: '2023-10-15',
        status: 'Active',
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Project Title and Metadata */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {project.title}
                    </h1>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {project.status}
                    </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: tag.color }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>

                {/* Short Description */}
                <p className="text-gray-600 mb-6">{project.description}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={() =>
                            window.open(project.githubLink, '_blank')
                        }
                        btnText={
                            <div className="flex items-center gap-2">
                                {icons.github}
                                <span>View on GitHub</span>
                            </div>
                        }
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                    />
                    <Button
                        onClick={() => navigate(`/project/${projectId}/tasks`)}
                        btnText="View Tasks"
                        className="bg-[#4977ec] hover:bg-[#3b62c2] text-white px-4 py-2 rounded-md"
                    />
                    <Button
                        onClick={() =>
                            navigate(`/project/${projectId}/contributors`)
                        }
                        btnText="Join Project"
                        className="bg-white border border-[#4977ec] text-[#4977ec] hover:bg-gray-50 px-4 py-2 rounded-md"
                    />
                </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Project Details
                </h2>
                <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{
                        __html: project.longDescription,
                    }}
                />
            </div>

            {/* Contributors Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Team
                </h2>
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <h3 className="font-medium text-gray-700">
                            Project Owner
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                            <img
                                src={project.owner.avatar}
                                alt={project.owner.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <span>{project.owner.name}</span>
                        </div>
                    </div>
                </div>

                <h3 className="font-medium text-gray-700 mb-3">
                    Contributors ({project.contributors.length})
                </h3>
                <div className="flex flex-wrap gap-4">
                    {project.contributors.map((contributor, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <img
                                src={contributor.avatar}
                                alt={contributor.name}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm">{contributor.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
