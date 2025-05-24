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
                    <div className="flex -space-x-2">
                        {project.contributors?.map((contributor, index) => (
                            <div key={index} className="relative">
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium shadow-sm"
                                    style={{
                                        zIndex:
                                            project.contributors.length - index,
                                        backgroundColor: !contributor.avatar
                                            ? `#${Math.floor(Math.random() * 16777215).toString(16)}`
                                            : '',
                                        backgroundImage: contributor.avatar
                                            ? url(contributor.avatar)
                                            : 'none',
                                        backgroundSize: 'cover',
                                    }}
                                    title={contributor.name}
                                >
                                    {!contributor.avatar &&
                                        contributor.name.charAt(0)}
                                </div>
                            </div>
                        ))}
                        {project.contributors?.length > 5 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                +{project.contributors.length - 5}
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={() =>
                            navigate(`/project/${project.projectId}`)
                        }
                        btnText={'View Project'}
                        className="text-white rounded-md px-[10px] py-[4px] h-[35px] bg-[#4977ec] hover:bg-[#3b62c2] transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}
