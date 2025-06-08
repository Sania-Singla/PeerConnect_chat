import { useResumeContext } from '@/Context';
import { formatDateMonth } from '@/Utils';
import parse from 'html-react-parser';

export default function AchievementsPreview() {
    const { resumeInfo } = useResumeContext();

    return resumeInfo.achievements.map((a, i) => (
        <div key={i} className="px-2 py-[5px] mb-[5px]">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800">{a.title}</h3>

                {a.date && (
                    <p className="text-[11px] italic">
                        {formatDateMonth(a.date)}
                    </p>
                )}
            </div>

            <div className="description text-[12px] mt-1 text-gray-800">
                {parse(a.description)}
            </div>
        </div>
    ));
}
