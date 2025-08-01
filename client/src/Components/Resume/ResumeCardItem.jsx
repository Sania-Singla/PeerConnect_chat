import { MoreVertical, Edit, Eye, Download, Trash2 } from 'lucide-react';
import { IMAGES } from '@/Constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import { usePopupContext } from '@/Context';
import { Button } from '..';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
        <div className="flex justify-center w-full">
            <div
                onClick={() => navigate(`/post/${post_id}`)}
                className="rounded-xl shadow-sm cursor-pointer relative group w-full transition-all duration-300 max-w-[400px]"
            >
                {/* Card Content */}
                <Link
                    to={`/resume/${resume.resumeId}/edit`}
                    className="block rounded-t-xl overflow-hidden w-full"
                >
                    <div
                        className="h-50 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center relative"
                        style={{
                            borderTop: `10px solid ${resume.themeColor}40`,
                            borderBottom: `1px solid ${resume.themeColor}20`,
                        }}
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
                <div className="relative w-full bg-white px-4 py-3 flex items-center justify-between border-t border-t-gray-100 rounded-b-xl">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                            {resume.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
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
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                transition={{
                                    duration: 0.1,
                                    ease: 'easeOut',
                                }}
                                className="w-34 absolute bottom-9 right-2 text-[14px] border border-gray-300 bg-white shadow-sm p-1 rounded-lg z-10"
                            >
                                {' '}
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
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
