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
import resume from '@/DummyData/resume';

export default function ResumePreview() {
    const { resumeInfo } = useResumeContext();

    resumeInfo.projects = [
        {
            title: 'PeerConnect',
            description:
                'PeerConnect is a decentralized social media platform that allows users to connect, share, and communicate without relying on centralized servers. It uses peer-to-peer technology to ensure privacy and security.',
            technologies: 'React, Node.js, WebRTC, IPFS',
            link: 'https://github.com/peerconnect',
        },
        {
            title: 'PeerConnect',
            description:
                'PeerConnect is a decentralized social media platform that allows users to connect, share, and communicate without relying on centralized servers. It uses peer-to-peer technology to ensure privacy and security.',
            technologies: 'React, Node.js, WebRTC, IPFS',
            link: 'https://github.com/peerconnect',
        },
    ];

    resumeInfo.experience = [
        {
            company: 'Microsoft',
            position: 'Software Engineer',
            startDate: '2022-01-01',
            endDate: '2023-12-31',
            address: {
                state: 'San Francisco',
                country: 'USA',
            },
            currentlyWorking: false,
            description:
                'Developed and maintained the PeerConnect platform, focusing on performance optimization and user experience.',
        },
        {
            company: 'Tech Solutions',
            position: 'Frontend Developer',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
            address: {
                state: 'New York',
                country: 'USA',
            },
            currentlyWorking: true,
            description:
                'Worked on various client projects, implementing responsive designs and improving site performance.',
        },
    ];

    resumeInfo.education = [
        {
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            major: 'Computer Science',
            startDate: '2018-09-01',
            endDate: '2022-06-30',
            address: {
                state: 'California',
                country: 'USA',
            },
            description:
                'Graduated with honors, focusing on software engineering and machine learning, Grad with honors, focusing on software engineering and machine learning.',
        },
        {
            institution: 'Massachusetts Institute of Technology (MIT)',
            degree: 'Master of Science',
            major: 'Artificial Intelligence',
            startDate: '2022-09-01',
            endDate: '2024-06-30',
            address: {
                state: 'Massachusetts',
                country: 'USA',
            },
            description:
                'Grad with honors, focusing on software engineering and machine learning, Grad with honors, focusing on software engineering and machine learning.',
        },
    ];

    return (
        <div
            className="w-full max-w-4xl shadow-sm rounded-lg print:shadow-none border border-gray-200"
            style={{
                borderTop: `8px solid ${resumeInfo?.themeColor}`,
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

            <main className="flex flex-col p-4 space-y-3 text-gray-800">
                {resumeInfo?.personal?.summary && (
                    <section>
                        <h2
                            className="font-bold text-sm tracking-wide border-b border-gray-200"
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
                            className="font-bold text-sm tracking-wide border-b border-gray-200"
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
                            className="font-bold text-sm tracking-wide border-b border-gray-200"
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
                            className="flex items-center gap-[5px] font-bold text-sm tracking-wide border-b"
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
                            className="font-bold text-sm tracking-wide border-b border-gray-200"
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
                            className="flex gap-[5px] items-center font-bold text-sm tracking-wide border-b"
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
                className="p-3 text-center text-[11px] border-t border-gray-100"
                style={{
                    backgroundColor: `${resumeInfo?.themeColor}15`,
                    color: `${resumeInfo?.themeColor}90`,
                }}
            >
                Generated with PeerConnect • {new Date().getFullYear()}
            </footer>
        </div>
    );
}
