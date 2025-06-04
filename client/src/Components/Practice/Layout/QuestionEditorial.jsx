import { useQuestionContext } from '@/Context/QuestionContext';

export default function QuestionEditorial() {
    const question = useQuestionContext();

    const getPlatformName = (url) => {
        try {
            const domain = new URL(url).hostname
                .replace('www.', '')
                .split('.')[0];
            return domain.charAt(0).toUpperCase() + domain.slice(1);
        } catch {
            return 'Source';
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        const match = url.match(/(?:\?v=|\.be\/)([a-zA-Z0-9_-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    return (
        <div className="bg-white p-4 rounded-lg">
            <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Approach</h3>
                <p>{question.editorial.description}</p>

                {question.editorial.images?.length > 0 && (
                    <img
                        src={question.editorial.images[0]}
                        alt="Solution visualization"
                        className="mt-3 rounded border border-gray-200 max-w-full"
                    />
                )}

                {question.editorial.reference && (
                    <div className="mt-4">
                        <a
                            href={question.editorial.reference}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:underline"
                        >
                            Read full editorial on{' '}
                            {getPlatformName(question.editorial.reference)}
                            <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    </div>
                )}

                {question.editorial.videos?.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-md font-semibold mb-2">
                            Video Editorials
                        </h4>
                        <ul className="space-y-6 mt-2">
                            {question.editorial.videos.map((video, index) => {
                                const embedUrl = getYouTubeEmbedUrl(video.url);
                                return (
                                    <li key={index}>
                                        <p className="font-medium text-[15px]">
                                            {video.title}
                                        </p>
                                        <p className="text-gray-700 text-sm italic mb-4">
                                            {video.description}
                                        </p>
                                        {embedUrl ? (
                                            <div className="aspect-w-16 aspect-h-9">
                                                <iframe
                                                    className="w-full h-full rounded-md border"
                                                    src={embedUrl}
                                                    title={video.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <a
                                                href={video.url}
                                                className="text-blue-600 hover:underline"
                                                target="_blank"
                                            >
                                                Watch Video
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
