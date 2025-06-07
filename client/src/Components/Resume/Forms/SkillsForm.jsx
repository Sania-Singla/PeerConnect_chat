import { useEffect, useState } from 'react';
import { Button } from '@/Components';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import { icons } from '@/Assets/icons';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import Input from '@/Components/General/Input';

export default function Skills() {
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!resumeInfo.skills?.length) {
            setResumeInfo((prev) => ({
                ...prev,
                skills: [
                    {
                        name: '',
                        rating: 0,
                    },
                ],
            }));
        }
    }, []);

    const handleChange = (index, name, value) => {
        setResumeInfo((prev) => ({
            ...prev,
            skills: prev.skills.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            ),
        }));
    };

    const AddNewSkills = () => {
        setResumeInfo((prev) => ({
            ...prev,
            skills: [...prev.skills, { name: '', rating: 0 }],
        }));
    };
    const RemoveSkills = () => {
        setResumeInfo((prev) => ({
            ...prev,
            skills: prev.skills.slice(0, -1),
        }));
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.saveSection(
                'skill',
                resumeId,
                resumeInfo.skills
            );
            if (res && !res.message) toast.success('Skills updated!');
        } catch (err) {
            toast.error('Failed to update skills');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Skills</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add Your top professional key skills
            </p>

            <div>
                {resumeInfo?.skills.map((s, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center gap-4 my-5"
                    >
                        <div className="w-full">
                            <Input
                                label="Name"
                                className="w-full sm:w-[70%]"
                                defaultValue={s.name}
                                placeholder="Enter a skill (e.g., JavaScript)"
                                onChange={(e) =>
                                    handleChange(i, 'name', e.target.value)
                                }
                            />
                        </div>
                        <Rating
                            style={{ maxWidth: 120 }}
                            value={s.rating}
                            className="h-fit relative top-2"
                            onChange={(v) => handleChange(i, 'rating', v)}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={AddNewSkills}
                        defaultStyles={true}
                        className="text-[15px] px-4 h-[30px] text-white"
                        btnText="+ Add More"
                    />
                    <Button
                        variant="outline"
                        onClick={RemoveSkills}
                        defaultStyles={true}
                        disabled={resumeInfo.skills.length === 0}
                        className="text-[15px] focus:ring-gray-500 text-black px-4 h-[30px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                        btnText="- Remove"
                    />
                </div>
                <Button
                    defaultStyles="true"
                    className="w-[60px] h-[30px] text-[15px] text-white"
                    disabled={loading}
                    onClick={onSave}
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
        </div>
    );
}
