import { Outlet, useParams } from 'react-router-dom';
import { ProjectHeader } from '@/Components';
import { ProjectContext } from '@/Context';
import { projects } from '@/DummyData/projects';

export default function ProjectLayout() {
    const { projectId } = useParams();
    const project = projects.find((project) => project.projectId == projectId);
    return (
        <ProjectContext.Provider value={project}>
            <ProjectHeader />
            <div className="flex-1 overflow-y-auto p-4">
                <Outlet />
            </div>
        </ProjectContext.Provider>
    );
}
