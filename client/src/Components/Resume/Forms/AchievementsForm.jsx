import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function AchievementsForm() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [achievements, setAchievements] = useState(
        resumeInfo?.achievements || []
    );
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (index, event) => {
        setAchievements((prev) =>
            prev.map((item, i) => (i === index ? event.target.value : item))
        );
    };

    const addNewAchievement = () => {
        setAchievements((prev) => prev.push(''));
    };

    const removeAchievement = () => {
        setAchievements(achievements.slice(0, -1));
    };

    // for preview
    useEffect(() => {
        setResumeInfo({ ...resumeInfo, achievements });
    }, [achievements]);

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.updateAchievements(
                resumeId,
                achievements
            );
            if (res && !res.message) toast.success('Achievements updated!');
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Achievements</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Add your notable achievements
            </p>

            <form onSubmit={onSave}>
                <div className="space-y-4 mt-4">
                    {achievements.map((item, index) => (
                        <Input
                            label="Achievement #{index + 1}"
                            type="text"
                            required
                            value={item}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="e.g. Awarded 'Employee of the Year' in 2022"
                            className="shadow-sm shadow-[#f7f7f7] py-3 rounded-[5px] placeholder:text-sm placeholder:text-gray-400 indent-3 w-full border-[0.01rem] border-gray-500 bg-transparent"
                        />
                    ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            defaultStyles={true}
                            className="text-primary px-4 py-1 text-white"
                            onClick={addNewAchievement}
                            btnText="+ Add Achievement"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            defaultStyles={true}
                            className="text-primary focus:ring-gray-500 text-black px-3 h-[35px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                            onClick={removeAchievement}
                            disabled={achievements.length === 0}
                            btnText="- Remove"
                        />
                    </div>
                    <Button
                        type="submit"
                        defaultStyles={true}
                        className="px-4 text-base py-[5px] text-white"
                        disabled={loading}
                        btnText={
                            loading ? (
                                <div className="flex items-center justify-center my-2 w-full">
                                    <div className="size-5 fill-[#4977ec] dark:text-[#f7f7f7]">
                                        {icons.loading}
                                    </div>
                                </div>
                            ) : (
                                'Save'
                            )
                        }
                    />
                </div>
            </form>
        </div>
    );
}
