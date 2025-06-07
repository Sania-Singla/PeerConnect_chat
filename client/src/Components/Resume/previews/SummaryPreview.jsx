import { useResumeContext } from '@/Context';

export default function SummaryPreview() {
    const { resumeInfo } = useResumeContext();

    return (
        <p className="text-[11px] px-2 py-[5px] leading-relaxed text-justify text-gray-800">
            {resumeInfo.personal?.summary}
        </p>
    );
}
