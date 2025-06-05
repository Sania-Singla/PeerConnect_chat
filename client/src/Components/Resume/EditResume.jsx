import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { resumeService } from '@/Services';
import { usePopupContext, useResumeContext } from '@/Context';
import toast from 'react-hot-toast';
import {
    SummaryForm,
    ExperienceForm,
    EducationForm,
    SkillsForm,
    AchievementsForm,
    PersonalInfoForm,
    Button,
    ResumePreview,
} from '@/Components';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function EditResume() {
    const { resumeId } = useParams();
    const { setResumeInfo } = useResumeContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [enableNext, setEnableNext] = useState(true);
    const [activeFormIndex, setActiveFormIndex] = useState(0);
    const { setPopupInfo, setShowPopup } = usePopupContext();

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const res = await resumeService.getResume(resumeId);
                if (res && !res.message) {
                    setResumeInfo(res);
                } else {
                    toast.error('Resume not found!');
                    navigate('/resume');
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, [resumeId]);

    const forms = [
        {
            title: 'Personal Details',
            component: <PersonalInfoForm enabledNext={setEnableNext} />,
        },
        {
            title: 'Summary',
            component: <SummaryForm enabledNext={setEnableNext} />,
        },
        { title: 'Experience', component: <ExperienceForm /> },
        { title: 'Education', component: <EducationForm /> },
        { title: 'Skills', component: <SkillsForm /> },
        { title: 'Achievements', component: <AchievementsForm /> },
    ];

    function handleThemeClick() {
        setShowPopup(true);
        setPopupInfo({ type: 'resumeTheme', resumeId });
    }

    return (
        <div className="h-full bg-gray-50 p-4 rounded-xl">
            {loading ? (
                <div>loading...</div>
            ) : (
                <div className="h-full mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* LEFT: form section */}
                    <div className="h-full bg-white p-4 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Edit Your Resume Details
                        </h2>
                        <div className="h-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <Button
                                    defaultStyles={true}
                                    onClick={handleThemeClick}
                                    className="py-1 px-2"
                                    btnText={<>Change Theme</>}
                                />

                                {/* Progress Stepper */}
                                <div className="flex items-center gap-1 overflow-x-auto py-2">
                                    {forms.map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-1"
                                        >
                                            <button
                                                onClick={() =>
                                                    setActiveFormIndex(i)
                                                }
                                                className={`flex items-center cursor-pointer justify-center size-7 rounded-full text-sm font-medium 
                                    ${
                                        activeFormIndex === i
                                            ? 'bg-[#4977ec] text-white'
                                            : 'bg-white border border-[#4977ec20] text-[#555555]'
                                    }`}
                                            >
                                                {i}
                                            </button>
                                            {i < forms.length - 1 && (
                                                <div className="w-5 h-[1px] bg-[#4977ec30]"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form */}
                            <div className="bg-white rounded-xl mb-6">
                                {forms[activeFormIndex]?.component || (
                                    <Navigate to={`/resume/${resumeId}/view`} />
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center">
                                <div>
                                    {activeFormIndex > 0 && (
                                        <Button
                                            defaultStyles={true}
                                            className="px-2 py-1"
                                            variant="outline"
                                            onClick={() =>
                                                setActiveFormIndex(
                                                    activeFormIndex - 1
                                                )
                                            }
                                            btnText={
                                                <>
                                                    <ArrowLeft className="w-5 h-5" />{' '}
                                                    Previous
                                                </>
                                            }
                                        />
                                    )}
                                </div>
                                <Button
                                    className={`py-1 px-4 ${!enableNext ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    onClick={() =>
                                        setActiveFormIndex((prev) => prev + 1)
                                    }
                                    disabled={!enableNext}
                                    defaultStyles={true}
                                    btnText={
                                        activeFormIndex < forms.length ? (
                                            <>
                                                Next
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        ) : (
                                            'Finish & Preview'
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: preview section */}
                    <div className="print:bg-white print:p-0 h-full bg-white p-4 rounded-2xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Live Resume Preview
                        </h2>
                        <ResumePreview />
                    </div>
                </div>
            )}
        </div>
    );
}
