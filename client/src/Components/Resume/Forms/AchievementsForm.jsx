import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function AchievementsForm() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [achievements, setAchievements] = useState(
        resumeInfo?.achievements?.length > 0
            ? resumeInfo.achievements
            : [{ title: '', description: '', date: '' }]
    );
    const [loading, setLoading] = useState(false);

    const handleChange = (index, event) => {
        setAchievements((prev) =>
            prev.map((item, i) => (i === index ? event.target.value : item))
        );
    };

    const addNewAchievement = () => {
        setAchievements((prev) => [
            ...prev,
            { title: '', description: '', date: '' },
        ]);
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
            const res = await resumeService.saveSection(
                'achievement',
                resumeId,
                achievements
            );
            if (res && !res.message) toast.success('Achievements updated!');
        } catch (err) {
            toast.error('Failed to update achievements');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Achievements</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add your notable achievements
            </p>

            <form onSubmit={onSave}>
                <div className="space-y-4 mt-4">
                    {achievements.map((item, i) => (
                        <Input
                            key={i}
                            label={`Achievement #${i + 1}`}
                            type="text"
                            required
                            value={item.title}
                            onChange={(e) => handleChange(i, e)}
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
                            className="text-[15px] px-4 h-[30px] text-white"
                            onClick={addNewAchievement}
                            btnText="+ Add More"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            defaultStyles={true}
                            className="text-[15px] focus:ring-gray-500 text-black px-4 h-[30px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                            onClick={removeAchievement}
                            disabled={achievements.length === 0}
                            btnText="- Remove"
                        />
                    </div>
                    <Button
                        type="submit"
                        defaultStyles={true}
                        className="w-[60px] text-[15px] h-[30px] text-white"
                        disabled={loading}
                        btnText={
                            loading ? (
                                <div className="flex items-center justify-center w-full">
                                    <div className="size-4 fill-[#4977ec] dark:text-[#f7f7f7]">
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
