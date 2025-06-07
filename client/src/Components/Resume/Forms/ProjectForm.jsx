import { BasicRTE, Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function ProjectForm() {
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo, emptyResume } = useResumeContext();

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        setResumeInfo((prev) => ({
            ...prev,
            projects: prev.projects.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            ),
        }));
    };

    const AddNewProject = () => {
        setResumeInfo((prev) => ({
            ...prev,
            projects: [...prev.projects, emptyResume.projects[0]],
        }));
    };
    const RemoveProject = () => {
        setResumeInfo((prev) => ({
            ...prev,
            projects: prev.projects.slice(0, -1),
        }));
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.saveSection(
                'project',
                resumeId,
                resumeInfo.projects
            );
            if (res && !res.message) toast.success('Project List updated!');
        } catch (err) {
            toast.error('Failed to update project list');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Projects</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add Your Project details
            </p>

            <div>
                {resumeInfo.projects?.map((item, i) => (
                    <div key={i}>
                        <div className="grid grid-cols-2 gap-5 my-5">
                            <Input
                                label="Title"
                                name="title"
                                type="text"
                                required
                                placeholder="e.g. AI Chatbot, Portfolio Website"
                                value={item.title}
                                onChange={(e) => handleChange(e, i)}
                            />

                            <Input
                                label="Technologies"
                                name="technologies"
                                required
                                placeholder="e.g. React, Node.js, Python"
                                type="text"
                                onChange={(e) => handleChange(e, i)}
                                value={item.technologies}
                            />

                            <Input
                                label="Link"
                                type="text"
                                name="link"
                                placeholder="e.g. https://github.com/username/project"
                                onChange={(e) => handleChange(e, i)}
                                value={item.link}
                            />

                            <div className="col-span-2 space-y-1">
                                <label className="block text-sm font-medium text-gray-800">
                                    Description
                                </label>
                                <BasicRTE
                                    name="description"
                                    value={item?.description}
                                    onChange={(e) => handleChange(e, i)}
                                    placeholder="Briefly describe the project's purpose, features, and outcome"
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
                        onClick={AddNewProject}
                        defaultStyles={true}
                        className="text-[15px] h-[30px] px-4 text-white"
                        btnText="+ Add More"
                    />
                    <Button
                        variant="outline"
                        onClick={RemoveProject}
                        defaultStyles={true}
                        disabled={resumeInfo.projects.length === 0}
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
