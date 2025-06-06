import { useEffect, useState } from 'react';
import { Button } from '@/Components';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import { icons } from '@/Assets/icons';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import Input from '@/Components/General/Input';

export default function Skills() {
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [skills, setSkills] = useState(
        resumeInfo?.skills || [{ name: '', rating: 0 }]
    );
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (index, name, value) => {
        setSkills((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const AddNewSkills = () => {
        setSkills((prev) => prev.push({ name: '', rating: 0 }));
    };
    const RemoveSkills = () => {
        setSkills((skillsList) => skillsList.slice(0, -1));
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.updateSkills(resumeId, skills);
            if (res && !res.message) toast.success('Skills updated!');
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    // for preview
    useEffect(() => setResumeInfo({ ...resumeInfo, skills }), [skills]);

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Skills</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Add Your top professional key skills
            </p>

            <div>
                {skills.map((item, index) => (
                    <div className="flex justify-between items-center gap-4 my-5">
                        <div className="w-full">
                            <Input
                                label="Name"
                                className="w-full sm:w-[70%]"
                                defaultValue={item.name}
                                placeholder="Enter a skill (e.g., JavaScript)"
                                onChange={(e) =>
                                    handleChange(index, 'name', e.target.value)
                                }
                            />
                        </div>
                        <Rating
                            style={{ maxWidth: 120 }}
                            value={item.rating}
                            className="h-fit relative top-2"
                            onChange={(v) => handleChange(index, 'rating', v)}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={AddNewSkills}
                        defaultStyles={true}
                        className="text-primary px-4 py-1"
                        btnText="+ Add More Skill"
                    />
                    <Button
                        variant="outline"
                        onClick={RemoveSkills}
                        className="text-primary bg-[#e14545] text-white px-4 py-1 rounded-lg"
                        btnText="- Remove"
                    />
                </div>
                <Button
                    defaultStyles="true"
                    className="px-4 py-1"
                    disabled={loading}
                    onClick={onSave}
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
        </div>
    );
}
