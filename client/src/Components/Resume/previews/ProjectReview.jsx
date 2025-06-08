import { useResumeContext } from '@/Context';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import parse from 'html-react-parser';

export default function ProjectsPreview() {
    const { resumeInfo } = useResumeContext();

    return resumeInfo?.projects?.map((project, i) => (
        <div key={i} className="px-2 py-[5px] mb-[5px] text-gray-800">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold">{project.title}</h3>

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

            <div className="text-[12px]">
                <p className="mt-1 description">{parse(project.description)}</p>

                {project.technologies.length > 0 && (
                    <div className="mt-[2px] ml-3">
                        <span className="font-semibold">
                            <span className="mr-[6px]">&bull;</span>
                            Technologies:{' '}
                        </span>
                        {project.technologies}
                    </div>
                )}
            </div>
        </div>
    ));
}
