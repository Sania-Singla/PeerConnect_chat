import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function ProjectForm() {
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [projectList, setProjectList] = useState(
        resumeInfo?.projects.length > 0
            ? resumeInfo.projects
            : [
                  {
                      title: '',
                      description: '',
                      technologies: '',
                      link: '',
                  },
              ]
    );

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        setProjectList((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    };

    const AddNewProject = () => {
        setProjectList((prev) => [
            ...prev,
            {
                title: '',
                description: '',
                technologies: '',
                link: '',
            },
        ]);
    };
    const RemoveProject = () => {
        setProjectList((projectList) => projectList.slice(0, -1));
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.saveSection(
                'project',
                resumeId,
                projectList
            );
            if (res && !res.message) toast.success('Project List updated!');
        } catch (err) {
            toast.error('Failed to update project list');
        } finally {
            setLoading(false);
        }
    }

    // for preview
    useEffect(
        () => setResumeInfo({ ...resumeInfo, projects: projectList }),
        [projectList]
    );

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Projects</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Add Your Project details
            </p>

            <div>
                {projectList?.map((item, i) => (
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

                            <div className="col-span-2">
                                <Input
                                    label="Description"
                                    name="description"
                                    type="textarea"
                                    required
                                    placeholder="Briefly describe the project's purpose, features, and outcome"
                                    onChange={(e) => handleChange(e, i)}
                                    value={item.description}
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
