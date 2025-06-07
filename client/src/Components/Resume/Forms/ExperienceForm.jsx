import { Button, RTE } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function Experience() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [experiences, setExperiences] = useState(
        resumeInfo?.experience.length > 0
            ? resumeInfo.experience
            : [
                  {
                      position: '',
                      company: '',
                      city: '',
                      state: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                  },
              ]
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

    const addNewExperience = () => {
        setExperiences((prev) => [
            ...prev,
            {
                position: '',
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
        () => setResumeInfo({ ...resumeInfo, experience: experiences }),
        [experiences]
    );

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.saveSection(
                'experience',
                resumeId,
                experiences
            );
            if (res && !res.message) toast.success('Experience updated!');
        } catch (err) {
            toast.error('Failed to update experience.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Professional Experience</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add your previous job experience
            </p>

            <form onSubmit={onSave}>
                {experiences?.map((item, i) => (
                    <div key={i} className="my-5 rounded-lg">
                        <div className="grid grid-cols-2 gap-5">
                            <Input
                                label="Position"
                                name="position"
                                id="position"
                                required
                                placeholder="e.g., Software Engineer, Marketing Intern"
                                onChange={(e) => handleChange(i, e)}
                                value={item?.position}
                            />

                            <Input
                                label="Company"
                                name="company"
                                id="company"
                                required
                                placeholder="e.g., Infosys, Google, Deloitte"
                                onChange={(e) => handleChange(i, e)}
                                value={item?.company}
                            />

                            <Input
                                label="City"
                                name="city"
                                id="city"
                                required
                                placeholder="e.g., Bangalore, New York"
                                onChange={(e) => handleChange(i, e)}
                                value={item?.city}
                            />

                            <Input
                                label="State"
                                name="state"
                                id="state"
                                required
                                placeholder="e.g., Karnataka, California"
                                onChange={(e) => handleChange(i, e)}
                                value={item?.state}
                            />

                            <Input
                                label="Start Date"
                                type="date"
                                name="startDate"
                                id="startDate"
                                required
                                placeholder="Select start date"
                                onChange={(e) => handleChange(i, e)}
                                value={item?.startDate}
                            />

                            <Input
                                label="End Date"
                                type="date"
                                id="endDate"
                                name="endDate"
                                required
                                placeholder="Select end date"
                                onChange={(e) => handleChange(i, e)}
                                value={item?.endDate}
                            />

                            <div className="col-span-2">
                                <Input
                                    type="textarea"
                                    label="Description"
                                    rows={3}
                                    name="description"
                                    placeholder="e.g., Worked on full-stack development, led a team of 3 interns, improved system performance by 20%"
                                    onChange={(e) => handleChange(i, e)}
                                    value={item?.description}
                                />
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
                            className="text-[15px] px-4 h-[30px] text-white"
                            onClick={addNewExperience}
                            btnText="+ Add More"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            defaultStyles={true}
                            className="text-[15px] focus:ring-gray-500 text-black px-4 h-[30px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                            onClick={removeExperience}
                            disabled={experiences.length === 0}
                            btnText="- Remove"
                        />
                    </div>
                    <Button
                        type="submit"
                        defaultStyles={true}
                        className="w-[60px] h-[30px] text-[15px] text-white"
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
