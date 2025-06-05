import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import RichTextEditor from '../RichTextEditor';
import { resumeService } from '@/Services';

export default function Experience() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [experiences, setExperiences] = useState(
        resumeInfo?.experience || []
    );
    const [loading, setLoading] = useState(false);

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        setExperiences((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const handleRichTextEditor = (e, name, index) => {
        const { value } = e.target.value;
        setExperiences((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const addNewExperience = () => {
        setExperiences((prev) =>
            prev.push({
                position: '',
                company: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                description: '',
            })
        );
    };

    const removeExperience = () => {
        setExperiences(experiences.slice(0, -1));
    };

    useEffect(() => {
        setResumeInfo({
            ...resumeInfo,
            experiences,
        });
    }, [experiences]);

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.updateExperience(
                resumeId,
                experiences
            );
            if (res && !res.message) toast.success('Experience List updated!');
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Professional Experience</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Add your previous job experience
            </p>

            <form onSubmit={onSave}>
                {experiences.map((item, index) => (
                    <div key={index} className="my-5 rounded-lg">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="position"
                                >
                                    Position
                                </label>
                                <Input
                                    name="position"
                                    id="position"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.position}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="company"
                                >
                                    Company
                                </label>
                                <Input
                                    name="company"
                                    id="company"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.company}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="city"
                                >
                                    City
                                </label>
                                <Input
                                    name="city"
                                    id="city"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.city}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="state"
                                >
                                    State
                                </label>
                                <Input
                                    name="state"
                                    id="state"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.state}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="startDate"
                                >
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.startDate}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="endDate"
                                >
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.endDate}
                                />
                            </div>
                            <div className="col-span-2">
                                <RichTextEditor
                                    index={index}
                                    defaultValue={item?.description}
                                    onRichTextEditorChange={(e) =>
                                        handleRichTextEditor(
                                            e,
                                            'description',
                                            index
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="text-primary"
                            onClick={addNewExperience}
                        >
                            + Add More Experience
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="text-primary"
                            onClick={removeExperience}
                            disabled={experiences.length === 0}
                        >
                            - Remove
                        </Button>
                    </div>
                    <Button
                        type="submit"
                        className="border-white rounded-lg px-6 text-base bg-[#4977ec] text-white"
                        disabled={loading}
                    >
                        {loading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
