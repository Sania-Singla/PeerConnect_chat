import { useResumeContext } from '@/Context';
import parse from 'html-react-parser';

export default function SummaryPreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <div className="description text-[12px] px-2 py-[5px] mb-[5px] text-justify text-gray-800">
            {parse(resumeInfo.personal?.summary)}
        </div>
    );
}
