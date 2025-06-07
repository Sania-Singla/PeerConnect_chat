import { useResumeContext } from '@/Context';

export default function AchievementsPreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <div className="my-6 px-3">
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 pl-1">
                {resumeInfo.achievements.map((item, i) => (
                    <div  key={i}>
                        <li key={i} className="leading-snug mb-1">
                            {item?.title}
                        </li>
                        <li key={i} className="leading-snug mb-1">
                            {item?.date}
                        </li>
                        <li key={i} className="leading-snug mb-1">
                            {item?.description}
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
}
