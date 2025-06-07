import { useResumeContext } from '@/Context';

export default function SkillsPreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-[5px] text-gray-800 px-2 py-[5px]">
            {resumeInfo.skills.map(
                (s, i) =>
                    s.name && (
                        <div key={i}>
                            <div className="flex justify-between text-xs font-medium">
                                <span>{s.name}</span>
                                <span>{s.rating}/5</span>
                            </div>
                            <div className="h-2 mt-1 bg-gray-200 rounded">
                                <div
                                    className="h-2 rounded"
                                    style={{
                                        backgroundColor: resumeInfo?.themeColor, // HEX, RGB, or CSS color string
                                        width: `${s.rating * 20}%`,
                                        printColorAdjust: 'exact',
                                        WebkitPrintColorAdjust: 'exact',
                                    }}
                                />
                            </div>
                        </div>
                    )
            )}
        </div>
    );
}
