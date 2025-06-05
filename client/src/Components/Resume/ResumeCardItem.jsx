import { MoreVertical, Edit, Eye, Download, Trash2 } from 'lucide-react';
import { IMAGES } from '@/Constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import { usePopupContext } from '@/Context';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function ResumeCardItem({ resume }) {
    const navigate = useNavigate();
    const { setShowPopup, setPopupInfo } = usePopupContext();

    async function handleDelete() {
        setShowPopup(true);
        setPopupInfo({ type: 'deleteResume', resume });
    }

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

                {/* Theme Color Accent */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: resume.themeColor }}
                />

                {/* ✨MAKE IT IN OUR STYLE */}

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
                            onClick={handleDelete}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
