import { useResumeContext } from '@/Context';
import { formatDateMonth } from '@/Utils';
import parse from 'html-react-parser';

export default function EducationPreview() {
    const { resumeInfo } = useResumeContext();

    return resumeInfo?.education.map((edu, index) => (
        <div key={index} className="px-2 py-[5px] mb-[5px]">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800">
                    {edu.institution}
                </h3>

                {edu.startDate && edu.endDate && (
                    <div className="text-[11px] italic">
                        {`${formatDateMonth(edu.startDate)} - ${formatDateMonth(edu.endDate)}`}
                    </div>
                )}
            </div>

            {edu.degree && (
                <p className="text-[12px] italic text-gray-700">
                    {edu.degree} in {edu.major}
                </p>
            )}

            {edu.description && (
                <div className="description text-[12px] mt-1 text-gray-800">
                    {parse(edu.description)}
                </div>
            )}
        </div>
    ));
}
