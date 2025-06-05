import { useResumeContext } from '@/Context';

export default function SkillsPreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {resumeInfo.skills.map((skill, i) => (
                <div key={i} className="flex flex-col">
                    <div className="flex justify-between text-xs font-medium">
                        <span>{skill.name}</span>
                        <span>{skill.rating}/5</span>
                    </div>
                    <div className="h-2 mt-1 bg-gray-200 rounded">
                        <div
                            className="h-2 rounded"
                            style={{
                                backgroundColor: resumeInfo?.themeColor, // HEX, RGB, or CSS color string
                                width: `${skill.rating * 20}%`,
                                printColorAdjust: 'exact',
                                WebkitPrintColorAdjust: 'exact',
                            }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
