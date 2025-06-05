import { MoreVertical, Edit, Eye, Download, Trash2 } from 'lucide-react';
import { IMAGES } from '@/Constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import { usePopupContext } from '@/Context';
import { Button } from '..';
import { useState, useRef, useEffect } from 'react';

export default function ResumeCardItem({ resume }) {
    const navigate = useNavigate();
    const { setShowPopup, setPopupInfo } = usePopupContext();
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownWrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownWrapperRef.current &&
                !dropdownWrapperRef.current.contains(event.target)
            ) {
                // Delay the close slightly to ensure toggle click registers first
                setTimeout(() => setShowDropdown(false), 0);
            }
        }

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    async function handleDelete() {
        setShowPopup(true);
        setPopupInfo({ type: 'deleteResume', resume });
    }

    return (
        <div className="group relative rounded-xl shadow-md transition-all duration-300">
            <div>
                {/* Card Content */}
                <Link to={`/resume/${resume.resumeId}/edit`} className="block">
                    <div
                        className="h-64 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center relative overflow-hidden rounded-t-xl"
                        style={{ borderTop: `3px solid ${resume.themeColor}` }}
                    >
                        <img
                            src={IMAGES.resume}
                            alt="Resume Preview"
                            className="size-16 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </Link>

                {/* Card Footer */}
                <div
                    style={{
                        borderBottom: `3px solid ${resume.themeColor}`,
                    }}
                    className="relative bg-white p-4 flex items-center justify-between border-t border-gray-100 rounded-b-xl"
                >
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                            {resume.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                            Last updated:{' '}
                            {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div ref={dropdownWrapperRef} className="relative">
                        <Button
                            onClick={() => setShowDropdown((prev) => !prev)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                            btnText={<MoreVertical className="h-5 w-5" />}
                        />

                        {showDropdown && (
                            <div
                                style={{
                                    border: `1px solid ${resume.themeColor}`,
                                }}
                                className="w-34 absolute bottom-10 -right-13 text-[14px] bg-white shadow-sm p-1 rounded-lg z-10"
                            >
                                <div
                                    onClick={() =>
                                        navigate(
                                            `/resume/${resume.resumeId}/edit`
                                        )
                                    }
                                    className="cursor-pointer flex gap-2 items-center p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <Edit className="size-4" />
                                    <span>Edit</span>
                                </div>
                                <div
                                    onClick={() =>
                                        navigate(
                                            `/resume/${resume.resumeId}/view`
                                        )
                                    }
                                    className="cursor-pointer flex gap-2 items-center p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <Eye className="size-4" />
                                    <span>Preview</span>
                                </div>
                                <div
                                    onClick={() =>
                                        navigate(
                                            `/resume/${resume.resumeId}/view`
                                        )
                                    }
                                    className="cursor-pointer flex gap-2 items-center p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <Download className="size-4" />
                                    <span>Download</span>
                                </div>
                                <div
                                    onClick={handleDelete}
                                    className="cursor-pointer flex gap-2 items-center p-2 hover:bg-gray-100 rounded-lg text-red-600"
                                >
                                    <Trash2 className="size-4" />
                                    <span>Delete</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
