import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function EducationForm() {
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [educationList, setEducationList] = useState(
        resumeInfo?.education || [
            {
                institution: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]
    );
    const navigate = useNavigate();

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        setEducationList((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const AddNewEducation = () => {
        setEducationList((prev) => [
            ...prev,
            {
                institution: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]);
    };
    const RemoveEducation = () => {
        setEducationList((educationalList) => educationalList.slice(0, -1));
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.updateEducation(
                resumeId,
                educationList
            );
            if (res && !res.message) toast.success('Education List updated!');
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    // for preview
    useEffect(
        () => setResumeInfo({ ...resumeInfo, education: educationList }),
        [educationList]
    );

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Education</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add Your educational details
            </p>

            <div>
                {educationList?.map((item, i) => (
                    <div key={i}>
                        <div className="grid grid-cols-2 gap-5 my-5">
                            <div className="col-span-2">
                                <Input
                                    label={'Institution Name'}
                                    name="institution"
                                    type="text"
                                    required
                                    placeholder="Enter the name of your college/university"
                                    value={item.institution}
                                    onChange={(e) => handleChange(e, i)}
                                />
                            </div>

                            <Input
                                label={'Degree'}
                                name="degree"
                                type="text"
                                required
                                placeholder="e.g., B.Tech, M.Sc, MBA"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.degree}
                            />

                            <Input
                                label={'Major'}
                                name="major"
                                required
                                placeholder="e.g., Computer Science, Physics"
                                type="text"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.major}
                            />

                            <Input
                                label={'Start Date'}
                                type="date"
                                name="startDate"
                                placeholder="Select start date"
                                onChange={(e) => handleChange(e, i)}
                                value={item?.startDate}
                            />
                            <Input
                                label={'End date'}
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
                                    placeholder="Briefly describe your coursework, achievements, or activities"
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
                        className="text-[15px] py-[5px] px-4 text-white"
                        btnText="+ Add More"
                    />
                    <Button
                        variant="outline"
                        onClick={RemoveEducation}
                        defaultStyles={true}
                        className="text-[15px] focus:ring-gray-500 text-black px-4 py-[5px] bg-gray-200 hover:bg-gray-300 rounded-lg"
                        btnText="- Remove"
                    />
                </div>
                <Button
                    disabled={loading}
                    onClick={onSave}
                    defaultStyles={true}
                    className="py-[5px] w-[60px] text-[15px] text-white"
                    btnText={
                        loading ? (
                            <div className="flex items-center justify-center w-full">
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
