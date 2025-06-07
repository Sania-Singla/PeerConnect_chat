import { useResumeContext } from '@/Context';

export default function ProjectsPreview() {
    const { resumeInfo } = useResumeContext();

    return resumeInfo?.projects?.map((project, index) => (
        <div key={index} className="mb-6">
            <h3
                className="text-sm font-bold mb-1"
                style={{ color: resumeInfo.themeColor }}
            >
                {project.title}
            </h3>

            <p className="text-xs text-gray-700 italic mb-2">
                {project.technologies}
            </p>

            <div className="text-xs mt-2 ml-4 text-gray-800 leading-relaxed">
                {project.description}
            </div>

            <div className="flex gap-4 mt-3 text-xs">
                {project.github && (
                    <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        GitHub
                    </a>
                )}
                {project.demoLink && (
                    <a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                    >
                        Live Demo
                    </a>
                )}
            </div>
        </div>
    ));
}
