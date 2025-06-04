import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../GlobalApi';
import { toast } from 'react-hot-toast';

function Education() {
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [educationalList, setEducationalList] = useState([
        {
            universityName: '',
            degree: '',
            major: '',
            startDate: '',
            endDate: '',
            description: '',
        },
    ]);

    useEffect(() => {
        resumeInfo?.education && setEducationalList(resumeInfo?.education);
    }, []);

    const handleChange = (event, index) => {
        const newEntries = educationalList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setEducationalList(newEntries);
    };

    const AddNewEducation = () => {
        setEducationalList([
            ...educationalList,
            {
                universityName: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ]);
    };
    const RemoveEducation = () => {
        setEducationalList((educationalList) => educationalList.slice(0, -1));
    };
    const onSave = () => {
        setLoading(true);
        const data = {
            education: educationalList.map(({ id, ...rest }) => rest),
        };

        GlobalApi.UpdateResumeDetail(params.resumeId, data);
        setLoading(false);
        toast.success('Details updated !');
    };

    useEffect(() => {
        setResumeInfo({
            ...resumeInfo,
            education: educationalList,
        });
    }, [educationalList]);
    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Education</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Add Your educational details
            </p>

            <div>
                {educationalList?.map((item, index) => (
                    <div key={index}>
                        <div className="grid grid-cols-2 gap-3 my-5">
                            <div className="col-span-2">
                                <label className="text-sm font-medium">
                                    University Name
                                </label>
                                <Input
                                    name="universityName"
                                    onChange={(e) => handleChange(e, index)}
                                    defaultValue={item?.universityName}
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
                        {' '}
                        + Add More Education
                    </Button>
                    <Button
                        variant="outline"
                        onClick={RemoveEducation}
                        className="text-primary"
                    >
                        {' '}
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

export default Education;
