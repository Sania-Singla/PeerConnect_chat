import { Outlet } from 'react-router-dom';

export default function ResumePage() {
    return (
        <div className="themed bg-transparent">
            <Outlet />
        </div>
    );
}
