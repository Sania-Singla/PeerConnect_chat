import { Input } from '../../ui/input';
import { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from '../../ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';

export default function Skills() {
    const [skills, setSkills] = useState(
        resumeInfo?.skills || [{ name: '', rating: 0 }]
    );
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const handleChange = (index, name, value) => {
        setSkills((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const AddNewSkills = () => {
        setSkills((prev) =>
            prev.push({
                name: '',
                rating: 0,
            })
        );
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
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                className="w-full sm:w-[70%]"
                                defaultValue={item.name}
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
                        className="text-primary"
                    >
                        + Add More Skill
                    </Button>
                    <Button
                        variant="outline"
                        onClick={RemoveSkills}
                        className="text-primary"
                    >
                        - Remove
                    </Button>
                </div>
                <Button
                    disabled={loading}
                    onClick={onSave}
                    className="border-white rounded-lg px-6 text-base bg-[#4977ec] text-white"
                >
                    {loading ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        'Save'
                    )}
                </Button>
            </div>
        </div>
    );
}
