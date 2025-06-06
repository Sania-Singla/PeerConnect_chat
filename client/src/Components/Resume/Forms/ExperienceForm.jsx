import { Button, RTE } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function Experience() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [experiences, setExperiences] = useState(
        resumeInfo?.experiences || []
    );
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        setExperiences((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const handleRichTextEditor = (content, name, index) => {
        setExperiences((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: content } : item
            )
        );
    };

    const addNewExperience = () => {
        setExperiences((prev) => [
            ...prev,
            {
                position: resumeInfo.experiences.position,
                company: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]);
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
                {experiences?.map((item, index) => (
                    <div key={index} className="my-5 rounded-lg">
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Position"
                                name="position"
                                id="position"
                                required
                                onChange={(e) => handleChange(index, e)}
                                value={item?.position}
                            />

                            <Input
                                label="Company"
                                name="company"
                                id="company"
                                required
                                onChange={(e) => handleChange(index, e)}
                                value={item?.company}
                            />

                            <Input
                                label="Ciy"
                                name="city"
                                id="city"
                                required
                                onChange={(e) => handleChange(index, e)}
                                value={item?.city}
                            />

                            <Input
                                label="State"
                                name="state"
                                id="state"
                                required
                                onChange={(e) => handleChange(index, e)}
                                value={item?.state}
                            />

                            <Input
                                label="Start Date"
                                type="date"
                                name="startDate"
                                id="startDate"
                                required
                                onChange={(e) => handleChange(index, e)}
                                value={item?.startDate}
                            />

                            <Input
                                label="End Date"
                                type="date"
                                id="endDate"
                                name="endDate"
                                required
                                onChange={(e) => handleChange(index, e)}
                                value={item?.endDate}
                            />
                            <div className="col-span">
                                <label className="block text-sm font-medium text-gray-800">
                                    Description
                                </label>

                                <div className="mt-2">
                                    <RTE
                                        onChange={() =>
                                            handleRichTextEditor(
                                                tinymce.activeEditor.getContent(),
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
                            defaultStyles={true}
                            type="button"
                            variant="outline"
                            className="text-primary px-4 py-[5px] text-white"
                            onClick={addNewExperience}
                            btnText="+ Add More Experience"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            defaultStyles={true}
                            className="text-primary focus:ring-gray-500 text-black px-3 h-[35px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                            onClick={removeExperience}
                            disabled={experiences.length === 0}
                            btnText="- Remove"
                        />
                    </div>
                    <Button
                        type="submit"
                        defaultStyles={true}
                        className=" px-4 py-[5px] text-base text-white"
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
