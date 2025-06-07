import {
    PersonalInfoPreview,
    EducationPreview,
    ExperiencePreview,
    SkillsPreview,
    AchievementsPreview,
    SummaryPreview,
} from '@/Components';
import { useResumeContext } from '@/Context';
import ProjectReview from './previews/ProjectReview';

export default function ResumePreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <div
            className="w-full max-w-4xl shadow-sm rounded-lg print:shadow-none border-t-[8px]"
            style={{
                borderColor: resumeInfo?.themeColor,
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <header
                className="px-4 py-6 border-b"
                style={{
                    backgroundColor: `${resumeInfo?.themeColor}10`,
                    borderColor: `${resumeInfo?.themeColor}10`,
                }}
            >
                <PersonalInfoPreview />
            </header>

            <main className="flex flex-col p-4 text-gray-800">
                {resumeInfo?.personal?.summary && (
                    <section>
                        <h2
                            className="font-bold text-[15px] tracking-wide border-b"
                            style={{
                                borderColor: `${resumeInfo.themeColor}40`,
                                color: resumeInfo?.themeColor,
                            }}
                        >
                            Summary
                        </h2>
                        <SummaryPreview />
                    </section>
                )}

                {resumeInfo?.education?.length > 0 && (
                    <section>
                        <h2
                            className="font-bold text-[15px] tracking-wide border-b"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                                color: resumeInfo?.themeColor,
                            }}
                        >
                            Education
                        </h2>
                        <EducationPreview />
                    </section>
                )}

                {resumeInfo?.experience?.length > 0 && (
                    <section>
                        <h2
                            className="font-bold text-[15px] tracking-wide border-b"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                                color: resumeInfo?.themeColor,
                            }}
                        >
                            Experience
                        </h2>
                        <ExperiencePreview />
                    </section>
                )}

                {resumeInfo?.skills?.length > 0 && (
                    <section>
                        <h2
                            className="flex items-center gap-[5px] font-bold text-[15px] tracking-wide border-b"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                                color: resumeInfo?.themeColor,
                            }}
                        >
                            Skills
                        </h2>
                        <SkillsPreview />
                    </section>
                )}

                {resumeInfo?.projects?.length > 0 && (
                    <section>
                        <h2
                            className="font-bold text-[15px] tracking-wide border-b"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                                color: resumeInfo?.themeColor,
                            }}
                        >
                            Projects
                        </h2>
                        <ProjectReview />
                    </section>
                )}

                {resumeInfo?.achievements?.length > 0 && (
                    <section>
                        <h2
                            className="flex gap-[5px] items-center font-bold text-[15px] tracking-wide border-b"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                                color: resumeInfo?.themeColor,
                            }}
                        >
                            Achievements
                        </h2>
                        <AchievementsPreview />
                    </section>
                )}
            </main>

            <footer
                className="p-3 text-center text-[11px] border-t"
                style={{
                    backgroundColor: `${resumeInfo?.themeColor}10`,
                    color: resumeInfo?.themeColor,
                    borderColor: `${resumeInfo?.themeColor}10`,
                }}
            >
                Generated with PeerConnect • {new Date().getFullYear()}
            </footer>
        </div>
    );
}
