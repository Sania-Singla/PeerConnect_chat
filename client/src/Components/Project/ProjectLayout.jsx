import { Outlet } from 'react-router-dom';
import { ProjectHeader } from '@/Components';

export default function ProjectLayout() {
    return (
        <>
            <ProjectHeader />
            <div>
                <Outlet />
            </div>
        </>
    );
}
