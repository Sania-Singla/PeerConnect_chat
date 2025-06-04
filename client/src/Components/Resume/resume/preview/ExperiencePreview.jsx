function ExperiencePreview({ resumeInfo }) {
    return resumeInfo.Experience?.map((exp, index) => (
        <div key={index} className="mb-6">
            <div className="flex justify-between items-center">
                <h3
                    className="text-sm font-bold"
                    style={{ color: resumeInfo?.themeColor }}
                >
                    {exp.title}
                </h3>
                <span className="text-[11px] text-gray-500">
                    {exp.startDate} -{' '}
                    {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
            </div>
            <p className="text-xs text-gray-700 mt-0.5 italic">
                {exp.companyName}, {exp.city}, {exp.state}
            </p>
            <div
                className="text-xs mt-2 ml-4 text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: exp?.workSummery }}
            />
        </div>
    ));
}

export default ExperiencePreview;
