import { useResumeContext } from '@/Context';
import { formatDateMonth } from '@/Utils';

export default function AchievementsPreview() {
    const { resumeInfo } = useResumeContext();

    return resumeInfo.achievements.map((a, i) => (
        <div key={i} className="px-2 py-[5px] mb-[5px]">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-800">{a.title}</h3>

                {a.date && (
                    <p className="text-[10px] italic">
                        {formatDateMonth(a.date)}
                    </p>
                )}
            </div>

            <p className="text-[11px] mt-1 ml-3 text-gray-800 leading-relaxed">
                {a.description}
            </p>
        </div>
    ));
}
