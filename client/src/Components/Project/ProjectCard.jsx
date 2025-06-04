import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components';

export default function ProjectCard({ project }) {
    const navigate = useNavigate();

    const getContrastColor = (hexColor) => {
        if (!hexColor) return '#000000';
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    };

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 hover:border-gray-200 group">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl"></div>
            </div>
            <div className="p-6 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    {/* Title */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                            {project.title}
                        </h3>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-end gap-2">
                        {project.tags?.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="py-1.5 px-3 rounded-full text-xs font-medium shadow-sm"
                                style={{
                                    backgroundColor: tag.color,
                                    color: getContrastColor(tag.color),
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed">
                    {project.description}
                </p>

                {/* Contributors and Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                            {project.contributors
                                ?.slice(0, 5)
                                .map((contributor, index) => (
                                    <div
                                        key={contributor.email || index}
                                        className="relative group"
                                        title={contributor.name}
                                    >
                                        <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                            {contributor.avatar ? (
                                                <img
                                                    src={contributor.avatar}
                                                    alt={contributor.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            'https://i.pravatar.cc/150?img=0';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500 bg-gray-200">
                                                    {contributor.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {project.contributors?.length > 5 && (
                            <span className="text-xs text-gray-500">
                                +{project.contributors.length - 5} more
                            </span>
                        )}
                    </div>
                    <Button
                        onClick={() =>
                            navigate(`/project/${project.projectId}`)
                        }
                        btnText={'View Project'}
                        className="text-white rounded-lg px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap"
                    />
                </div>
            </div>
        </div>
    );
}
