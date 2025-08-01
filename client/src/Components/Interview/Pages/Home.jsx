import { Button, InterviewCard } from '@/Components';
import { useNavigate } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { IMAGES } from '@/Constants/constants';
import { interviews } from '@/DummyData/interviews';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <section className="relative overflow-hidden bg-[#f9f9f9] p-8 shadow-sm">
                <div className="flex flex-col gap-6 max-w-md relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Prepare for Your Next Interview
                    </h2>
                    <p className="text-gray-500">
                        Tackle authentic interview questions specific to the
                        role & receive immediate feedback
                    </p>

                    <Button
                        defaultStyles={true}
                        className="py-2 mt-4 text-white"
                        onClick={() => navigate('/interview/1')}
                        btnText={
                            <div className="flex items-center gap-2">
                                <span>Start an Interview</span>
                                <div className="fill-white size-4">
                                    {icons.rightArrow}
                                </div>
                            </div>
                        }
                    />
                </div>

                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 max-md:hidden">
                    <img
                        src={IMAGES.robot}
                        alt="robot-image"
                        width={400}
                        height={400}
                        className="animate-float"
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 opacity-15 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </section>

            <section className="flex flex-col gap-6 mt-8 p-4 pt-0">
                <div className="flex items-center gap-2 w-full">
                    <hr className="w-full text-gray-300" />
                    <h2 className="text-xl font-medium text-gray-800 text-nowrap">
                        Take Interviews
                    </h2>
                    <hr className="w-full text-gray-300" />
                </div>

                <div className="grid grid-flow-dense gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(300px,max-content))] justify-center">
                    {interviews.map((interview) => (
                        <InterviewCard
                            key={interview.id}
                            interview={interview}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
