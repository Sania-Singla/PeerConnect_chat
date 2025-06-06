import { PlusSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, ResumeCardItem } from '@/Components';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '@/Constants/constants';
import { resumeService } from '@/Services';
import { usePopupContext, useUserContext } from '@/Context';

export default function ResumePage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const { user } = useUserContext();
    const { setShowPopup, setPopupInfo } = usePopupContext();

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const res = await resumeService.getResumes(user.user_id);
                if (res && !res.message) {
                    setResumes(res);
                }
            } catch (err) {
                console.log(err);
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    function handleCreateResume() {
        setShowPopup(true);
        setPopupInfo({ type: 'newResume' });
    }

    return loading ? (
        <div>loading...</div>
    ) : (
        <div className="p-4 themed bg-transparent">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#f9f9f9] rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
                <div className="flex flex-col gap-6 max-w-lg relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Build Your Professional Resume
                    </h2>
                    <p className="text-gray-500">
                        Create tailored resumes for different roles and download
                        them in multiple formats
                    </p>

                    <Button
                        defaultStyles={true}
                        className="text-white py-2 mt-4 w-full"
                        onClick={handleCreateResume}
                        btnText={
                            <div className="flex items-center gap-3">
                                <span>Create New Resume</span>
                                <PlusSquare className="size-5" />
                            </div>
                        }
                    />
                </div>

                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 max-md:hidden">
                    <img
                        src={IMAGES.resumeCover}
                        alt="resume-document"
                        width={400}
                        height={400}
                        className="animate-float"
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 opacity-15 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </section>

            {/* Resume Cards Section */}
            <section className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold">Your Resumes</h2>

                {resumes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add Resume Card */}
                        <div
                            className="h-full flex flex-col items-center justify-center gap-3 p-6 
                            border-2 border-dashed border-gray-300 rounded-xl bg-white hover:border-[#4977ec]
                            transition-all duration-300 cursor-pointer hover:shadow-md"
                            onClick={handleCreateResume}
                        >
                            <PlusSquare className="size-8 text-[#4977ec]" />
                            <h3 className="text-lg font-medium text-gray-700">
                                Add New Resume
                            </h3>
                        </div>

                        {/* Existing Resumes */}
                        {resumes.map((r) => (
                            <ResumeCardItem resume={r} key={r.resumeId} />
                        ))}
                    </div>
                ) : (
                    <Button
                        onClick={handleCreateResume}
                        className="bg-white hover:brightness-95 transition-all duration-200 shadow-sm rounded-xl flex flex-col items-center justify-center border border-gray-200 min-h-[200px]"
                        btnText={
                            <div>
                                <PlusSquare className="size-8 mx-auto text-[#4977ec] mb-3" />
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    No Resumes Created Yet
                                </h3>
                                <p className="text-gray-500 mb-4 text-sm">
                                    Get started by creating your first
                                    professional resume
                                </p>
                            </div>
                        }
                    />
                )}
            </section>
        </div>
    );
}
