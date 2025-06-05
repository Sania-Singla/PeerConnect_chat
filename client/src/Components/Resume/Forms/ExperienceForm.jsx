import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import RichTextEditor from '../RichTextEditor';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';

export default function Experience() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [experiences, setExperiences] = useState(
        resumeInfo?.experiences || []
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

    useEffect(
        () => setResumeInfo({ ...resumeInfo, experiences }),
        [experiences]
    );

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.updateExperience(
                resumeId,
                experiences
            );
            if (res && !res.message) toast.success('Experience updated!');
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
                                <input
                                    name="position"
                                    id="position"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    value={item?.position}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="company"
                                >
                                    Company
                                </label>
                                <input
                                    name="company"
                                    id="company"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    value={item?.company}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="city"
                                >
                                    City
                                </label>
                                <input
                                    name="city"
                                    id="city"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    value={item?.city}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="state"
                                >
                                    State
                                </label>
                                <input
                                    name="state"
                                    id="state"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    value={item?.state}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="startDate"
                                >
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    value={item?.startDate}
                                />
                            </div>
                            <div>
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="endDate"
                                >
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    value={item?.endDate}
                                />
                            </div>
                            <div>
                                <label className="text-[14px] font-medium">
                                    Discription
                                </label>

                                <div className="col-span-2">
                                    <RichTextEditor
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
                    </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="text-primary"
                            onClick={addNewExperience}
                            btnText="+ Add More Experience"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="text-primary"
                            onClick={removeExperience}
                            disabled={experiences.length === 0}
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
