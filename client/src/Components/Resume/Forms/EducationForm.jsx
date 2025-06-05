import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';

export default function Education() {
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
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
    useEffect(() => {
        setResumeInfo({
            ...resumeInfo,
            education: educationList,
        });
    }, [educationList]);

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Education</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Add Your educational details
            </p>

            <div>
                {educationList?.map((item, index) => (
                    <div key={index}>
                        <div className="grid grid-cols-2 gap-3 my-5">
                            <div className="col-span-2">
                                <label className="text-sm font-medium">
                                    Institution Name
                                </label>
                                <Input
                                    name="institution"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.institution}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Degree
                                </label>
                                <Input
                                    name="degree"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.degree}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Major
                                </label>
                                <Input
                                    name="major"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.major}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.startDate}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.endDate}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium">
                                    Description
                                </label>
                                <Textarea
                                    name="description"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.description}
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
                    >
                        + Add More Education
                    </Button>
                    <Button
                        variant="outline"
                        onClick={RemoveEducation}
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
