import { useResumeContext } from '@/Context';
import { formatDateMonth } from '@/Utils';
import parse from 'html-react-parser';

export default function ExperiencePreview() {
    const { resumeInfo } = useResumeContext();

    return resumeInfo?.experience?.map((exp, i) => (
        <div key={i} className="px-2 py-[5px] mb-[5px]">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-800">
                    {exp.position}
                </h3>

                {exp.address && (
                    <p className="text-gray-700 text-[10px] italic">
                        {exp.address.state}, {exp.address.country}
                    </p>
                )}
            </div>

            <div className="flex items-center text-gray-700 justify-between">
                <p className="text-[11px] italic">{exp.company}</p>

                {exp.startDate && exp.endDate && (
                    <p className="text-[10px] italic">
                        {`${formatDateMonth(exp.startDate)} - 
                        ${
                            exp.currentlyWorking
                                ? 'Present'
                                : formatDateMonth(exp.endDate)
                        }`}
                    </p>
                )}
            </div>

            <div className="description text-[11px] mt-1 text-gray-800 leading-relaxed">
                {parse(exp?.description)}
            </div>
        </div>
    ));
}
