import { useResumeContext } from '@/Context';

export default function SkillsPreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <div className="text-gray-800 px-2 py-[5px] mb-[5px] flex items-center gap-3">
            {resumeInfo.skills.map((s, i) => (
                <div key={i} className="text-[0.73rem]">
                    {s.name}
                </div>
            ))}
        </div>
    );
}
