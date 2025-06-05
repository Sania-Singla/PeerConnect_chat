import { Button } from '@/Components';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { icons } from '@/Assets/icons';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';

export default function AchievementsForm() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [achievements, setAchievements] = useState(
        resumeInfo?.achievements || []
    );
    const [loading, setLoading] = useState(false);

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
                        <div key={index}>
                            <label className="text-sm font-medium block mb-1">
                                Achievement #{index + 1}
                            </label>
                            <input
                                type="text"
                                required
                                value={item}
                                onChange={(e) => handleChange(index, e)}
                                placeholder="e.g. Awarded 'Employee of the Year' in 2022"
                                className="shadow-sm shadow-[#f7f7f7] py-3 rounded-[5px] placeholder:text-sm placeholder:text-gray-400 indent-3 w-full border-[0.01rem] border-gray-500 bg-transparent"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="text-primary"
                            onClick={addNewAchievement}
                            btnText="+ Add Achievement"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="text-primary"
                            onClick={removeAchievement}
                            disabled={achievements.length === 0}
                            btnText="- Remove"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="border-white rounded-lg px-6 text-base bg-[#4977ec] text-white"
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
