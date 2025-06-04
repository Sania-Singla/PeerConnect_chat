function AchievementsPreview({ resumeInfo }) {
    if (!resumeInfo?.achievements?.length) return null;

    return (
        <div className="my-6 px-3">
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 pl-1">
                {resumeInfo.achievements.map((item, i) => (
                    <li key={i} className="leading-snug mb-1">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AchievementsPreview;
