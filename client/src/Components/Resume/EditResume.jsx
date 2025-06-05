import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import toast from 'react-hot-toast';
import {
    PersonalInfoPreview,
    EducationPreview,
    ExperiencePreview,
    SkillsPreview,
    AchievementsPreview,
    SummaryPreview,
    SummaryForm,
    ExperienceForm,
    EducationForm,
    SkillsForm,
    AchievementsForm,
    PersonalInfoForm,
    Button,
    ThemeColor,
} from '@/Components';
import { Award, Star, ArrowLeft, ArrowRight } from 'lucide-react';

export default function EditResume() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [enableNext, setEnableNext] = useState(true);
    const [activeFormIndex, setActiveFormIndex] = useState(0);

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
                                <ThemeColor />

                                {/* Progress Stepper */}
                                <div className="flex items-center gap-1 overflow-x-auto py-2">
                                    {forms.map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-1"
                                        >
                                            <button
                                                onClick={() =>
                                                    setActiveFormIndex(i + 1)
                                                }
                                                className={`flex items-center cursor-pointer justify-center size-7 rounded-full text-sm font-medium 
                                    ${
                                        activeFormIndex === i + 1
                                            ? 'bg-[#4977ec] text-white'
                                            : 'bg-white border border-[#4977ec20] text-[#555555]'
                                    }`}
                                            >
                                                {i + 1}
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
                                            variant="outline"
                                            className="border-[#4977ec] hover:bg-[#4977ec10] text-[#4977ec] gap-2"
                                            onClick={() =>
                                                setActiveFormIndex(
                                                    activeFormIndex - 1
                                                )
                                            }
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            Previous
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    className={`bg-[#4977ec] hover:bg-[#3b62c2] text-white gap-2 
                        ${!enableNext ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    onClick={() =>
                                        setActiveFormIndex((prev) => prev + 1)
                                    }
                                    disabled={!enableNext}
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
                        <div
                            className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden print:shadow-none border-2"
                            style={{
                                borderTop: `8px solid ${resumeInfo.themeColor}`,
                                fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            <header
                                className="p-6 border-b-2"
                                style={{
                                    backgroundColor: `${resumeInfo.themeColor}10`,
                                    borderColor: `${resumeInfo.themeColor}10`,
                                }}
                            >
                                <PersonalInfoPreview resumeInfo={resumeInfo} />
                            </header>

                            <main className="flex flex-col p-4 space-y-10 text-gray-800">
                                {resumeInfo?.summary && (
                                    <section>
                                        <h2
                                            className="font-semibold text-sm text-gray-900 tracking-wide mb-3 border-b border-gray-200 pb-1"
                                            style={{
                                                borderColor: `${resumeInfo.themeColor}40`,
                                            }}
                                        >
                                            Summary
                                        </h2>
                                        <SummaryPreview
                                            resumeInfo={resumeInfo}
                                        />
                                    </section>
                                )}

                                {resumeInfo?.experiences?.length > 0 && (
                                    <section>
                                        <h2
                                            className="font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b border-gray-200 pb-1"
                                            style={{
                                                borderColor: `${resumeInfo.themeColor}40`,
                                            }}
                                        >
                                            Experience
                                        </h2>
                                        <ExperiencePreview
                                            resumeInfo={resumeInfo}
                                        />
                                    </section>
                                )}

                                {resumeInfo?.educationList?.length > 0 && (
                                    <section>
                                        <h2
                                            className="font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b border-gray-200 pb-1"
                                            style={{
                                                borderColor: `${resumeInfo.themeColor}40`,
                                            }}
                                        >
                                            Education
                                        </h2>
                                        <EducationPreview
                                            resumeInfo={resumeInfo}
                                        />
                                    </section>
                                )}

                                {resumeInfo?.skills?.length > 0 && (
                                    <section>
                                        <h2
                                            className="flex items-center gap-[5px] font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                                            style={{
                                                borderColor: `${resumeInfo.themeColor}40`,
                                            }}
                                        >
                                            <Star
                                                className="size-4"
                                                style={{
                                                    color: resumeInfo.themeColor,
                                                }}
                                            />
                                            <span className="pt-[1px]">
                                                Skills
                                            </span>
                                        </h2>
                                        <SkillsPreview
                                            resumeInfo={resumeInfo}
                                        />
                                    </section>
                                )}

                                {resumeInfo?.achievements?.length > 0 && (
                                    <section>
                                        <h2
                                            className="flex gap-[5px] items-center font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                                            style={{
                                                borderColor: `${resumeInfo.themeColor}40`,
                                            }}
                                        >
                                            <Award
                                                style={{
                                                    color: resumeInfo.themeColor,
                                                }}
                                                className="size-4"
                                            />
                                            <span className="pt-[1px]">
                                                Achievements
                                            </span>
                                        </h2>
                                        <AchievementsPreview
                                            resumeInfo={resumeInfo}
                                        />
                                    </section>
                                )}
                            </main>

                            <footer
                                className="p-4 text-center text-[11px] text-gray-500 border-t border-gray-100"
                                style={{
                                    backgroundColor: `${resumeInfo.themeColor}15`,
                                }}
                            >
                                Generated with PeerConnect •{' '}
                                {new Date().getFullYear()}
                            </footer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
