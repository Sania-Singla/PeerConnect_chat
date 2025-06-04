import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../GlobalApi';
import { toast } from 'react-hot-toast';
import RichTextEditor from '../RichTextEditor';

function Experience() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const [experinceList, setExperinceList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        resumeInfo?.Experience?.length > 0 &&
            setExperinceList(resumeInfo?.Experience);
    }, []);

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const newEntries = [...experinceList];
        newEntries[index][name] = value;
        setExperinceList(newEntries);
    };

    const handleRichTextEditor = (e, name, index) => {
        const newEntries = [...experinceList];
        newEntries[index][name] = e.target.value;
        setExperinceList(newEntries);
    };

    const addNewExperience = () => {
        setExperinceList([
            ...experinceList,
            {
                title: '',
                companyName: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                workSummery: '',
            },
        ]);
    };

    const removeExperience = () => {
        setExperinceList(experinceList.slice(0, -1));
    };

    useEffect(() => {
        setResumeInfo({
            ...resumeInfo,
            Experience: experinceList,
        });
    }, [experinceList]);

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            Experience: experinceList.map(({ id, ...rest }) => rest),
        };
        GlobalApi.UpdateResumeDetail(resumeId, data);
        setLoading(false);
        toast.success('Details updated!');
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Professional Experience</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Add your previous job experience
            </p>

            <form onSubmit={onSave}>
                {experinceList.map((item, index) => (
                    <div key={index} className="my-5 rounded-lg">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium">
                                    Position Title
                                </label>
                                <Input
                                    name="title"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.title}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Company Name
                                </label>
                                <Input
                                    name="companyName"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.companyName}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    City
                                </label>
                                <Input
                                    name="city"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.city}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    State
                                </label>
                                <Input
                                    name="state"
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.state}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    required
                                    onChange={(e) => handleChange(index, e)}
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
                                    required
                                    onChange={(e) => handleChange(index, e)}
                                    defaultValue={item?.endDate}
                                />
                            </div>
                            <div className="col-span-2">
                                <RichTextEditor
                                    index={index}
                                    defaultValue={item?.workSummery}
                                    onRichTextEditorChange={(e) =>
                                        handleRichTextEditor(
                                            e,
                                            'workSummery',
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
                            disabled={experinceList.length === 0}
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

export default Experience;
