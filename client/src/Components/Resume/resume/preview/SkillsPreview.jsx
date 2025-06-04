function SkillsPreview({ resumeInfo }) {
    console.log(resumeInfo?.skills);
    return (
        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {resumeInfo?.skills?.map((skill, index) => (
                <div key={index} className="flex flex-col">
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

export default SkillsPreview;
