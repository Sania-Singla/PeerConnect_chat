import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';

export default function EducationForm() {
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const navigate = useNavigate();
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

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        setEducationList((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const AddNewEducation = () => {
        setEducationList((prev) =>
            prev.push({
                institution: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            })
        );
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
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Education</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Add Your educational details
            </p>

            <div>
                {educationList?.map((item, i) => (
                    <div key={i}>
                        <div className="grid grid-cols-2 gap-3 my-5">
                            <div className="col-span-2">
                                <label className="text-sm font-medium">
                                    Institution Name
                                </label>
                                <input
                                    name="institution"
                                    type="text"
                                    required
                                    value={item.institution}
                                    onChange={(e) => handleChange(e, index)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Degree
                                </label>
                                <input
                                    name="degree"
                                    type="text"
                                    required
                                    onChange={(e) => handleChange(e, index)}
                                    value={item?.degree}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Major
                                </label>
                                <input
                                    name="major"
                                    required
                                    type="text"
                                    onChange={(e) => handleChange(e, index)}
                                    value={item?.major}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => handleChange(e, index)}
                                    value={item?.startDate}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    onChange={(e) => handleChange(e, index)}
                                    value={item?.endDate}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    onChange={(e) => handleChange(e, index)}
                                    value={item?.description}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={AddNewEducation}
                        className="text-primary"
                        btnText="+ Add More Education"
                    />
                    <Button
                        variant="outline"
                        onClick={RemoveEducation}
                        className="text-primary"
                        btnText="- Remove"
                    />
                </div>
                <Button
                    disabled={loading}
                    onClick={onSave}
                    className="border-white rounded-lg px-6 text-base bg-[#4977ec] text-white"
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
