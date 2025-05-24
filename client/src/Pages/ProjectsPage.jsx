import { ProjectCard } from '@/Components';
import { projects } from '@/DummyData/projects';

export default function ProjectsPage() {
    return (
        <div className="p-4 grid grid-cols-2 gap-4">
            {projects.map((project) => (
                <ProjectCard key={project.projectId} project={project} />
            ))}
        </div>
    );
}
