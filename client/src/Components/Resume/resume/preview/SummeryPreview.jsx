function SummaryPreview({ resumeInfo }) {
    const { summary } = resumeInfo || {};

    if (!summary) return null;

    return (
        <p className="text-xs leading-relaxed text-justify text-gray-800">
            {summary}
        </p>
    );
}

export default SummaryPreview;
