import { useResumeContext } from '@/Context';

export default function SummaryPreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <p className="text-xs leading-relaxed text-justify text-gray-800">
            {resumeInfo.personal?.summary}
        </p>
    );
}
