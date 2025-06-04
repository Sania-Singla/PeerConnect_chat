import { ProjectCard } from '@/Components';
import { projects } from '@/DummyData/projects';

export default function ProjectsPage() {
    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.projectId} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
}