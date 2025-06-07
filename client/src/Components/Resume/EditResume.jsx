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
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import ProjectForm from './Forms/ProjectForm';

export default function EditResume() {
    const { resumeId } = useParams();
    const { setResumeInfo, emptyResume, enableNext } = useResumeContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeFormIndex, setActiveFormIndex] = useState(0);
    const { setPopupInfo, setShowPopup } = usePopupContext();

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const res = await resumeService.getResume(resumeId);
                if (res && !res.message) {
                    setResumeInfo({
                        ...res,
                        experience: res.experience.length
                            ? res.experience
                            : emptyResume.experience,
                        education: res.education.length
                            ? res.education
                            : emptyResume.education,
                        projects: res.projects.length
                            ? res.projects
                            : emptyResume.projects,
                        achievements: res.achievements.length
                            ? res.achievements
                            : emptyResume.achievements,
                        skills: res.skills.length
                            ? res.skills
                            : emptyResume.skills,
                    });
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
        { title: 'Personal Details', component: <PersonalInfoForm /> },
        { title: 'Summary', component: <SummaryForm /> },
        { title: 'Education', component: <EducationForm /> },
        { title: 'Experience', component: <ExperienceForm /> },
        { title: 'Skills', component: <SkillsForm /> },
        { title: 'Projects', component: <ProjectForm /> },
        { title: 'Achievements', component: <AchievementsForm /> },
    ];

    function handleThemeClick() {
        setShowPopup(true);
        setPopupInfo({ type: 'resumeTheme', resumeId });
    }

    return (
        <div className="h-full p-1 overflow-hidden">
            {loading ? (
                <div>loading...</div>
            ) : (
                <div className="h-full mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* LEFT: form section */}
                    <div className="h-full bg-white p-4 rounded-2xl border border-gray-200 shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Edit Your Resume
                        </h2>
                        <div className="h-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <Button
                                    onClick={handleThemeClick}
                                    className="flex gap-2 shadow-sm items-center border-[#4977ec] text-[#4977ec] hover:bg-[#4977ec] hover:text-white transition-all duration-100 border rounded-md px-2 py-1"
                                    btnText={
                                        <>
                                            <LayoutGrid size={16} /> Theme
                                        </>
                                    }
                                />

                                {/* Progress Stepper */}
                                <div className="flex items-center gap-1 py-2">
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
                                            className="border py-[5px] px-3 rounded-md border-[#4977ec] hover:bg-[#4977ec] hover:text-white transition-all duration-100 text-[#4977ec] gap-2"
                                            onClick={() =>
                                                setActiveFormIndex(
                                                    activeFormIndex - 1
                                                )
                                            }
                                            btnText={
                                                <div className="flex gap-2 items-center">
                                                    <ArrowLeft className="w-5 h-5" />{' '}
                                                    Previous
                                                </div>
                                            }
                                        />
                                    )}
                                </div>
                                <Button
                                    defaultStyles="true"
                                    className={`text-white gap-2 py-[5px] px-3 ${!enableNext && 'opacity-70 cursor-not-allowed'}`}
                                    onClick={() =>
                                        setActiveFormIndex((prev) => prev + 1)
                                    }
                                    disabled={!enableNext}
                                    btnText={
                                        activeFormIndex < forms.length ? (
                                            <div className="flex items-center gap-2">
                                                Next
                                                <ArrowRight className="size-5" />
                                            </div>
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
