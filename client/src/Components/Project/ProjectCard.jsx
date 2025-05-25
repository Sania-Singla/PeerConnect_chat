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
        <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200 hover:border-gray-300">
            {/* Project Header */}
            <div className="p-5">
                <div className="flex justify-between items-start gap-2 mb-2">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800">
                        {project.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap justify-end gap-1">
                        {project.tags?.slice(0, 2).map((tag, index) => (
                            <span
                                key={index}
                                className="py-[5px] px-3 rounded-full text-xs font-medium"
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
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                </p>

                {/* Contributors and Button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex -space-x-2">
                            {project.contributors
                                ?.slice(0, 5)
                                .map((contributor, index) => (
                                    <div key={index} className="relative group">
                                        <div
                                            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium shadow-sm relative overflow-hidden"
                                            style={{
                                                zIndex:
                                                    project.contributors
                                                        .length - index,
                                                backgroundColor:
                                                    !contributor.avatar
                                                        ? '#e5e7eb'
                                                        : 'transparent',
                                            }}
                                            title={contributor.name}
                                        >
                                            {contributor.avatar ? (
                                                <img
                                                    src={contributor.avatar}
                                                    alt={contributor.name}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            'none';
                                                        e.target.nextSibling.style.display =
                                                            'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <span
                                                className={`${contributor.avatar ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                                            >
                                                {contributor.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                            {contributor.name}
                                        </div>
                                    </div>
                                ))}
                            {project.contributors?.length > 5 && (
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 cursor-default"
                                    title={`${project.contributors.length - 5} more contributors`}
                                >
                                    +{project.contributors.length - 5}
                                </div>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={() =>
                            navigate(`/project/${project.projectId}`)
                        }
                        btnText={'View Project'}
                        className="text-white rounded-md px-3 py-2 h-[35px] bg-[#4977ec] hover:bg-[#3b62c2] transition-colors text-sm font-medium"
                    />
                </div>
            </div>
        </div>
    );
}
