import { BasicRTE, Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function AchievementsForm() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo, emptyResume } = useResumeContext();
    const [loading, setLoading] = useState(false);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setResumeInfo((prev) => ({
            ...prev,
            achievements: prev.achievements.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            ),
        }));
    };

    const addNewAchievement = () => {
        setResumeInfo((prev) => ({
            ...prev,
            achievements: [...prev.achievements, emptyResume.achievements[0]],
        }));
    };

    const removeAchievement = () => {
        setResumeInfo((prev) => ({
            ...prev,
            achievements: prev.achievements.slice(0, -1),
        }));
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.saveSection(
                'achievements',
                resumeId,
                resumeInfo.achievements
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
                {resumeInfo.achievements?.map((item, i) => (
                    <div key={i} className="grid grid-cols-2 gap-5 my-5">
                        <Input
                            label="Title"
                            name="title"
                            type="text"
                            required
                            value={item?.title}
                            onChange={(e) => handleChange(e, i)}
                            placeholder="e.g. Best Innovator Award"
                        />
                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            required
                            value={item?.date}
                            onChange={(e) => handleChange(e, i)}
                            placeholder="Select date"
                        />
                        <div className="col-span-2 space-y-1">
                            <label className="block text-sm font-medium text-gray-800">
                                Description
                            </label>
                            <BasicRTE
                                name="description"
                                value={item?.description}
                                onChange={(e) => handleChange(e, i)}
                                placeholder="e.g. Recognized for outstanding innovation and leadership in AI projects."
                            />
                        </div>
                    </div>
                ))}

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
                            disabled={resumeInfo.achievements.length === 0}
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
