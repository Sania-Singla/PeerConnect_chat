import {
    PersonalInfoPreview,
    EducationPreview,
    ExperiencePreview,
    SkillsPreview,
    AchievementsPreview,
    SummaryPreview,
} from '@/Components';
import { useResumeContext } from '@/Context';
import { Award, Star } from 'lucide-react';

export default function ResumePreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <div
            className="w-full max-w-4xl shadow-sm rounded-lg overflow-hidden print:shadow-none border border-gray-200"
            style={{
                borderTop: `8px solid ${resumeInfo?.themeColor}`,
                fontFamily: 'Inter, sans-serif',
            }}
        >
            <header
                className="p-6 border-b-2"
                style={{
                    backgroundColor: `${resumeInfo?.themeColor}10`,
                    borderColor: `${resumeInfo?.themeColor}10`,
                }}
            >
                <PersonalInfoPreview />
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
                        <SummaryPreview />
                    </section>
                )}

                {resumeInfo?.experiences?.length > 0 && (
                    <section>
                        <h2
                            className="font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b border-gray-200 pb-1"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                            }}
                        >
                            Experience
                        </h2>
                        <ExperiencePreview />
                    </section>
                )}

                {resumeInfo?.educationList?.length > 0 && (
                    <section>
                        <h2
                            className="font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b border-gray-200 pb-1"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                            }}
                        >
                            Education
                        </h2>
                        <EducationPreview />
                    </section>
                )}

                {resumeInfo?.skills?.length > 0 && (
                    <section>
                        <h2
                            className="flex items-center gap-[5px] font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                            }}
                        >
                            <Star
                                className="size-4"
                                style={{
                                    color: resumeInfo?.themeColor,
                                }}
                            />
                            <span className="pt-[1px]">Skills</span>
                        </h2>
                        <SkillsPreview />
                    </section>
                )}

                {resumeInfo?.achievements?.length > 0 && (
                    <section>
                        <h2
                            className="flex gap-[5px] items-center font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                            style={{
                                borderColor: `${resumeInfo?.themeColor}40`,
                            }}
                        >
                            <Award
                                style={{
                                    color: resumeInfo?.themeColor,
                                }}
                                className="size-4"
                            />
                            <span className="pt-[1px]">Achievements</span>
                        </h2>
                        <AchievementsPreview />
                    </section>
                )}
            </main>

            <footer
                className="p-4 text-center text-[11px] text-gray-400 border-t border-gray-100"
                style={{
                    backgroundColor: `${resumeInfo?.themeColor}15`,
                }}
            >
                Generated with PeerConnect • {new Date().getFullYear()}
            </footer>
        </div>
    );
}
