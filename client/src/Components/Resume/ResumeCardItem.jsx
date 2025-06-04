import {
    Loader2Icon,
    MoreVertical,
    Edit,
    Eye,
    Download,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import GlobalApi from './GlobalApi';
import { toast } from 'sonner';
import { IMAGES } from '@/Constants/constants';

function ResumeCardItem({ resume, refreshData }) {
    const navigate = useNavigate();
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        setLoading(true);
        try {
            await GlobalApi.DeleteResumeById(resume.resumeId);
            toast.success('Resume deleted successfully');
            refreshData();
        } catch (error) {
            toast.error('Failed to delete resume');
        } finally {
            setLoading(false);
            setOpenAlert(false);
        }
    };

    return (
        <div className="group relative overflow-hidden rounded-xl shadow-md transition-all duration-300">
            {/* Card Content */}
            <Link to={`/resume/${resume.resumeId}/edit`} className="block">
                <div
                    className="h-64 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center relative overflow-hidden"
                    style={{ borderTop: `4px solid ${resume.themeColor}` }}
                >
                    {/* Resume Preview Image */}
                    <img
                        src={IMAGES.resume}
                        alt="Resume Preview"
                        className="size-16 object-contain transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </Link>

            {/* Card Footer */}
            <div className="bg-white p-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                        {resume.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                        Last updated:{' '}
                        {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Actions Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                navigate(`/resume/${resume.resumeId}/edit`)
                            }
                            className="cursor-pointer"
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                navigate(`/resume/${resume.resumeId}/view`)
                            }
                            className="cursor-pointer"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                navigate(`/resume/${resume.resumeId}/view`)
                            }
                            className="cursor-pointer"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setOpenAlert(true)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                    <AlertDialogContent setOpenAlert={setOpenAlert}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete this resume?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete "{resume.title}"
                                and cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onDelete}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                            >
                                {loading ? (
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Delete Resume
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Theme Color Accent */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: resume.themeColor }}
            />
        </div>
    );
}

export default ResumeCardItem;
