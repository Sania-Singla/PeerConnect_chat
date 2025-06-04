import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { getRandomInterviewCover } from '../Lib/utils';
import { Button, DisplayTechIcons } from '@/Components';
import { icons } from '@/Assets/icons';

export default function InterviewCard({ interview }) {
    const { id, role, type, techstack, createdAt, description } = interview;
    const formattedDate = dayjs(createdAt).format('MMM D, YYYY');
    const feedback = JSON.parse(
        localStorage.getItem(`interview-${id}-feedback`)
    );

    return (
        <div className="relative min-w-[280px] max-sm:w-full min-h-90 bg-[#f9f9f9] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4977ec] to-blue-700"></div>
            <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-blue-500/10 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-blue-600/10 blur-xl"></div>

            <div className="p-4 relative z-10">
                <div>
                    {/* Type Badge */}
                    <div className="text-white font-medium text-sm absolute top-4 right-4 w-fit px-4 py-1.5 rounded-lg bg-[#4977ec] drop-shadow-sm">
                        {type}
                    </div>

                    {/* Cover Image */}
                    <div className="relative">
                        <div className="absolute -z-10 size-[80px] rounded-full bg-blue-500/20 blur-sm"></div>
                        <img
                            src={getRandomInterviewCover()}
                            alt="cover-image"
                            className="rounded-full object-cover size-[80px] border-2 border-gray-200 shadow-sm"
                        />
                    </div>

                    {/* Interview Role */}
                    <h3 className="mt-5 capitalize text-gray-800 font-semibold text-xl">
                        {role} Interview
                    </h3>

                    {/* Date & Score */}
                    <div className="flex flex-row align-items-center gap-5 mt-3 text-gray-800">
                        <div className="flex flex-row gap-2 items-center">
                            <div className="fill-[#202020] size-4">
                                {icons.date}
                            </div>
                            <p className="text-sm">{formattedDate}</p>
                        </div>
                    </div>

                    <div className="border-gray-200 border rounded-lg p-2 mt-4 bg-[#f6f6f6] text-gray-700 text-sm line-clamp-2 h-[54px]">
                        {feedback?.finalAssessment || description}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6 border-t-[0.09rem] border-gray-200 pt-6">
                    <DisplayTechIcons techStack={techstack} />

                    <Button
                        className="text-white rounded-md py-[5px] w-fit px-3 flex items-center justify-center text-lg bg-[#4977ec] hover:bg-[#3b62c2]"
                        btnText={
                            <Link
                                to={
                                    feedback?.finalAssessment
                                        ? `/interview/${id}/feedback`
                                        : `/interview/${id}`
                                }
                                className="flex items-center gap-1"
                            >
                                {feedback?.finalAssessment
                                    ? 'View Feedback'
                                    : 'View Interview'}
                                <div className="fill-white size-3 ml-1">
                                    {icons.rightArrow}
                                </div>
                            </Link>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
