import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function EducationForm() {
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo, emptyResume } = useResumeContext();

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        setResumeInfo((prev) => ({
            ...prev,
            education: prev.education.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            ),
        }));
    };

    const AddNewEducation = () => {
        setResumeInfo((prev) => ({
            ...prev,
            education: [...prev.education, emptyResume.education[0]],
        }));
        setResumeInfo((prev) => ({ ...prev, enableNext: true }));
    };
    const RemoveEducation = () => {
        setResumeInfo((prev) => ({
            ...prev,
            education: prev.education.slice(0, -1),
        }));
        setResumeInfo((prev) => ({ ...prev, enableNext: true }));
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.saveSection(
                'education',
                resumeId,
                resumeInfo.education
            );
            if (res && !res.message) toast.success('Education List updated!');
        } catch (err) {
            toast.error('Failed to update education list');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Education</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add Your educational details
            </p>

            <div>
                {resumeInfo.education?.map((item, i) => (
                    <div key={i}>
                        <div className="grid grid-cols-2 gap-5 my-5">
                            <div className="col-span-2">
                                <Input
                                    label="Institution Name"
                                    name="institution"
                                    type="text"
                                    required
                                    placeholder="e.g., UIET, Panjab University"
                                    value={item.institution}
                                    onChange={(e) => handleChange(e, i)}
                                />
                            </div>

                            <Input
                                label="Degree"
                                name="degree"
                                type="text"
                                required
                                placeholder="e.g., B.Tech, M.Sc, MBA"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.degree}
                            />

                            <Input
                                label="Major"
                                name="major"
                                required
                                placeholder="e.g., Computer Science, Physics"
                                type="text"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.major}
                            />

                            <Input
                                label="Start Date"
                                type="date"
                                name="startDate"
                                placeholder="Select start date"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.startDate}
                            />

                            <Input
                                label="End Date"
                                type="date"
                                name="endDate"
                                placeholder="Select end date"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.endDate}
                            />

                            <div className="col-span-2">
                                <Input
                                    type="textarea"
                                    label="Description"
                                    rows={3}
                                    name="description"
                                    placeholder="e.g., Completed key coursework in Data Structures, won coding competitions, served as tech club president"
                                    onChange={(e) => handleChange(e, i)}
                                    value={item?.description}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={AddNewEducation}
                        defaultStyles={true}
                        className="text-[15px] h-[30px] px-4 text-white"
                        btnText="+ Add More"
                    />
                    <Button
                        variant="outline"
                        onClick={RemoveEducation}
                        defaultStyles={true}
                        disabled={resumeInfo.education.length === 0}
                        className="text-[15px] focus:ring-gray-500 text-black px-4 h-[30px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                        btnText="- Remove"
                    />
                </div>
                <Button
                    disabled={loading}
                    onClick={onSave}
                    defaultStyles={true}
                    className="h-[30px] w-[60px] text-[15px] text-white"
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
