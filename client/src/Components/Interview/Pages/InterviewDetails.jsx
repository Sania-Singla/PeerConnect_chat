import { useParams } from 'react-router-dom';
import Agent from '../Components/Agent';
import { interviews } from '@/DummyData/interviews';
import { getRandomInterviewCover } from '../Lib/utils';
import { useUserContext } from '@/Context';

export default function InterviewDetails() {
    const { id } = useParams();
    const { user } = useUserContext();

    const interview = interviews.find((i) => i.id === id);

    return (
        <div className="px-4 md:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    {/* Cover Image */}
                    <img
                        src={getRandomInterviewCover()}
                        alt="cover-image"
                        className="rounded-full object-cover size-10 border-2 border-gray-200 shadow-sm"
                    />

                    <h1 className="text-2xl font-bold h-fit pb-2">
                        {interview.role} Interview
                    </h1>
                </div>

                {/* Type Badge */}
                <div className="font-medium text-sm w-fit px-4 py-1 rounded-full bg-transparent border border-[#4977ec] text-[#4977ec] shadow-sm">
                    {interview.type}
                </div>
            </div>

            <Agent userName={user?.user_name || 'You'} interview={interview} />
        </div>
    );
}
