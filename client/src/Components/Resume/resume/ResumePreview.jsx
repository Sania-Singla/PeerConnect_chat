import { ResumeInfoContext } from '../ResumeInfoContext';
import React, { useContext } from 'react';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import AchievementsPreview from './preview/AchievementsPreview';
import { Award, Star } from 'lucide-react';

function ResumePreview() {
    const { resumeInfo } = useContext(ResumeInfoContext);
    const themeColor = resumeInfo?.themeColor || '#4977ec';

    return (
        <div className="flex justify-center min-h-[calc(100%-45px)] bg-gray-50 print:bg-white print:p-0">
            <div
                className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden print:shadow-none border-2"
                style={{
                    borderTop: `8px solid ${themeColor}`,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {/* Header with Contact Info */}
                <header
                    className="p-6 border-b-2"
                    style={{
                        backgroundColor: `${themeColor}10`,
                        borderColor: `${themeColor}10`,
                    }}
                >
                    <PersonalDetailPreview resumeInfo={resumeInfo} />
                </header>

                {/* Main Content */}
                <main className="flex flex-col">
                    {/* Left Column */}
                    <section className="p-4 space-y-10 text-gray-800">
                        {resumeInfo?.summary && (
                            <section>
                                <h2
                                    className="font-semibold text-sm text-gray-900 tracking-wide mb-3 border-b border-gray-200 pb-1"
                                    style={{ borderColor: `${themeColor}40` }}
                                >
                                    Professional Summary
                                </h2>
                                <SummeryPreview resumeInfo={resumeInfo} />
                            </section>
                        )}

                        {resumeInfo?.Experience?.length > 0 && (
                            <section>
                                <h2
                                    className="font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b border-gray-200 pb-1"
                                    style={{ borderColor: `${themeColor}40` }}
                                >
                                    Work Experience
                                </h2>
                                <ExperiencePreview resumeInfo={resumeInfo} />
                            </section>
                        )}

                        {resumeInfo?.education?.length > 0 && (
                            <section>
                                <h2
                                    className="font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b border-gray-200 pb-1"
                                    style={{ borderColor: `${themeColor}40` }}
                                >
                                    Education
                                </h2>
                                <EducationalPreview resumeInfo={resumeInfo} />
                            </section>
                        )}
                        {resumeInfo?.skills?.length > 0 && (
                            <section>
                                <h2
                                    className="flex items-center gap-[5px] font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                                    style={{ borderColor: `${themeColor}40` }}
                                >
                                    <Star
                                        className="size-4"
                                        style={{
                                            color: themeColor,
                                        }}
                                    />
                                    <span className="pt-[1px]">Skills</span>
                                </h2>
                                <SkillsPreview resumeInfo={resumeInfo} />
                            </section>
                        )}

                        {resumeInfo?.achievements?.length > 0 && (
                            <section>
                                <h2
                                    className="flex gap-[5px] items-center font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                                    style={{ borderColor: `${themeColor}40` }}
                                >
                                    <Award
                                        style={{
                                            color: themeColor,
                                        }}
                                        className="size-4"
                                    />
                                    <span className="pt-[1px]">
                                        Achievements
                                    </span>
                                </h2>
                                <AchievementsPreview resumeInfo={resumeInfo} />
                            </section>
                        )}
                    </section>

                    {/* Right Column Sidebar */}
                    {/* <aside
                        className={`md:w-1/3 p-4 bg-gray-50 md:border-l-2 space-y-10`}
                        style={{ borderColor: `${themeColor}10` }}
                    >
                        {resumeInfo?.skills?.length > 0 && (
                            <section>
                                <h2
                                    className="flex items-center gap-[5px] font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                                    style={{ borderColor: `${themeColor}40` }}
                                >
                                    <Star
                                        className="size-4"
                                        style={{
                                            color: themeColor,
                                        }}
                                    />
                                    <span className="pt-[1px]">Skills</span>
                                </h2>
                                <SkillsPreview resumeInfo={resumeInfo} />
                            </section>
                        )}

                        {resumeInfo?.achievements?.length > 0 && (
                            <section>
                                <h2
                                    className="flex gap-[5px] items-center font-semibold text-sm text-gray-900 tracking-wide mb-4 border-b pb-1"
                                    style={{ borderColor: `${themeColor}40` }}
                                >
                                    <Award
                                        style={{
                                            color: themeColor,
                                        }}
                                        className="size-4"
                                    />
                                    <span className="pt-[1px]">
                                        Achievements
                                    </span>
                                </h2>
                                <AchievementsPreview resumeInfo={resumeInfo} />
                            </section>
                        )}
                    </aside> */}
                </main>

                {/* Footer */}
                <footer
                    className="p-4 text-center text-[11px] text-gray-500 border-t border-gray-100"
                    style={{ backgroundColor: `${themeColor}15` }}
                >
                    Generated with PeerConnect • {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    );
}

export default ResumePreview;
