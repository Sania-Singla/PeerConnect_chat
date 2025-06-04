import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getInterviewById, saveFeedback } from '../Lib/feedback';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { botService } from '@/Services';

export default function Feedback() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const messages = location.state?.messages || [];

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                const interviewData = getInterviewById(id);
                if (!interviewData) {
                    navigate('/interview');
                    return;
                }
                setInterview(interviewData);

                let feedback = JSON.parse(
                    localStorage.getItem(
                        `interview-${interviewData.id}-feedback`
                    )
                );

                if (!feedback) {
                    // generate feedback
                    feedback = await botService.feedback(messages);
                    saveFeedback(interviewData.id, feedback);
                }

                setFeedback(feedback);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-600">
                getting feedback...
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-3xl relative bg-[#f9f9f9] text-gray-800 py-12 px-6 overflow-hidden shadow-sm rounded-xl">
            {/* decorators */}
            <div className="absolute w-48 h-48 bg-[#4977ec] rounded-full top-0 -left-24 opacity-20 transform rotate-45"></div>
            <div className="absolute w-64 h-64 bg-[#4977ec] rounded-full bottom-0 -right-32 opacity-20 transform rotate-12"></div>

            <div className="flex flex-col gap-10">
                <div className="text-center">
                    <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#4977ec] to-[#3b62c2]">
                        Feedback on the -{' '}
                        <span className="capitalize">{interview.role}</span>{' '}
                        Interview
                    </h1>
                    <p className="mt-3 text-gray-500">
                        Detailed assessment and review
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {/* Overall Impression */}
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-300">
                        <p className="font-semibold text-[#4977ec] select-none cursor-default">
                            ⭐ Overall Impression:{' '}
                            <span className="font-bold">
                                {feedback.totalScore}/100
                            </span>
                        </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-300">
                        <div className="size-4 fill-[#4977ec]">
                            {icons.date}
                        </div>
                        <p className="text-gray-600 select-text">
                            {dayjs(feedback.createdAt).format(
                                'MMM D, YYYY h:mm A'
                            )}
                        </p>
                    </div>
                </div>

                <hr className="border-gray-300" />

                <div
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 relative overflow-hidden"
                    style={{
                        backgroundImage: `
      linear-gradient(to right, #f6f6f6 1px, transparent 1px),
      linear-gradient(to bottom, #f6f6f6 1px, transparent 1px)
    `,
                        backgroundSize: '50px 50px',
                    }}
                >
                    <p className="leading-relaxed text-gray-700 text-[15px] tracking-wide">
                        {feedback.finalAssessment}
                    </p>
                </div>

                {/* Interview Breakdown */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                    <h2 className="text-2xl font-bold mb-6 border-b border-[#4977ec] pb-3 text-[#4977ec]">
                        Breakdown of the Interview:
                    </h2>
                    <div className="flex flex-col gap-8">
                        {feedback.categoryScores?.map((category, i) => (
                            <div
                                key={i}
                                className="space-y-2 p-4 rounded-md bg-[#e8f0fe] hover:bg-[#d0e1fd] transition-colors cursor-pointer"
                                title={category.comment}
                            >
                                <p className="font-semibold text-gray-800 text-lg">
                                    {i + 1}. {category.name} ({category.score}
                                    /100)
                                </p>
                                <p className="text-sm text-gray-600">
                                    {category.comment}
                                </p>
                            </div>
                        )) || <p>No category scores available.</p>}
                    </div>
                </div>

                <div className="relative bg-white p-6 rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                    <div className="absolute size-28 bg-[#4977ec] rounded-full -bottom-13 -left-12 opacity-20 transform rotate-45"></div>
                    <div className="absolute size-34 bg-[#4977ec] rounded-full -top-12 -right-12 opacity-20 transform rotate-12"></div>

                    <h3 className="text-xl font-semibold border-b border-[#4977ec] pb-2 mb-5 text-[#4977ec]">
                        Strengths
                    </h3>
                    <ul className="list-disc text-[15px] list-inside space-y-2 text-gray-700">
                        {feedback.strengths?.map((strength, i) => (
                            <li key={i} title={strength}>
                                {strength}
                            </li>
                        )) || <li>No strengths listed.</li>}
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
                    <h3 className="text-xl font-semibold border-b border-[#4977ec] pb-2 mb-5 text-[#4977ec]">
                        Areas for Improvement
                    </h3>
                    <ul className="list-disc text-[15px] list-inside space-y-2 text-gray-700">
                        {feedback.areasForImprovement?.map((area, i) => (
                            <li key={i} title={area}>
                                {area}
                            </li>
                        )) || <li>No areas for improvement listed.</li>}
                    </ul>
                </div>

                <div className="flex flex-row gap-4 mt-1 font-semibold">
                    <Button
                        className="text-white rounded-md py-2 w-full px-3 flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2] transition-shadow shadow-sm hover:shadow-sm"
                        btnText={<Link to="/interview">Back to dashboard</Link>}
                    />
                    <Button
                        className="text-white rounded-md py-2 w-full px-3 flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2] transition-shadow shadow-sm hover:shadow-sm"
                        btnText={
                            <Link to={`/interview/${id}`}>
                                Retake Interview
                            </Link>
                        }
                    />
                </div>
            </div>
        </section>
    );
}
