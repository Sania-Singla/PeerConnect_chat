import { useResumeContext } from '@/Context';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export default function ProjectsPreview() {
    const { resumeInfo } = useResumeContext();

    return resumeInfo?.projects?.map((project, index) => (
        <div key={index} className="px-2 py-[5px] mb-[5px] text-gray-800">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-bold ">{project.title}</h3>

                {project.link && (
                    <div className="flex gap-[5px] max-w-[40%] items-center justify-center">
                        <Link
                            to={project.link}
                            target="_blank"
                            className="hover:underline truncate text-[0.7rem]"
                            style={{ color: resumeInfo?.themeColor }}
                        >
                            {project.link}
                        </Link>
                        <div>
                            <ExternalLink
                                size={12}
                                color={resumeInfo?.themeColor}
                                strokeWidth={2.5}
                                className="mb-[2px]"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="pl-3 text-[11px] leading-relaxed">
                <div className="mt-1">{project.description}</div>

                <p className="mt-[2px]">
                    <span className="font-semibold">Technologies: </span>
                    {project.technologies}
                </p>
            </div>
        </div>
    ));
}
