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
        <div className="bg-transparent">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#f9f9f9] rounded- p-8 shadow-sm mb-8">
                <div className="flex flex-col gap-6 max-w-md relative z-10">
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
            <section className="flex flex-col gap-6 px-4 pb-4">
                <div className="flex items-center gap-2">
                    <hr className="w-full text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-800 text-nowrap">
                        Your Resumes
                    </h2>
                    <hr className="w-full text-gray-300" />
                </div>
                {resumes.length > 0 && (
                <div className="grid grid-flow-dense gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(300px,max-content))] justify-center">
                        {resumes.map((r) => (
                            <ResumeCardItem resume={r} key={r.resumeId} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
