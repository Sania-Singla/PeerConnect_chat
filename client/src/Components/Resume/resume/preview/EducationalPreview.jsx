function EducationalPreview({ resumeInfo }) {
    return resumeInfo?.education.map((edu, index) => (
        <div key={index} className="mb-6">
            <div className="flex justify-between items-center">
                <h3
                    className="text-sm font-bold"
                    style={{ color: resumeInfo?.themeColor }}
                >
                    {edu.universityName}
                </h3>
                <span className="text-[11px] text-gray-500">
                    {edu.startDate} - {edu.endDate}
                </span>
            </div>
            <p className="text-xs italic text-gray-700 mt-0.5">
                {edu.degree} in {edu.major}
            </p>
            {edu.description && (
                <p className="text-xs mt-2 text-gray-800">{edu.description}</p>
            )}
        </div>
    ));
}

export default EducationalPreview;
