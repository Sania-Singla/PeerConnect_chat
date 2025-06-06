import { FileText } from 'lucide-react';
import { useState } from 'react';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '@/Services';
import { usePopupContext } from '@/Context';
import Input from '../General/Input';

export default function NewResumePopup() {
    const [resumeTitle, setResumeTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setShowPopup } = usePopupContext();

    async function onCreate() {
        try {
            if (!resumeTitle.trim()) return;
            setLoading(true);

            const res = await resumeService.createResume(resumeTitle);
            if (res && !res.message) {
                setShowPopup(false);
                navigate(`/resume/${res.resumeId}/edit`);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-[350px] md:w-[400px] bg-white p-6 rounded-lg shadow-md">
            <div>
                <h2 className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4977ec]" />
                    Create New Resume
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Give your resume a title to get started
                </p>
            </div>

            <div className="py-4">
                <Input
                    label="Resume Title"
                    id="resume-title"
                    placeholder="e.g. Senior Frontend Developer Resume"
                    className="w-full focus:border-[#4977ec] focus:ring-1 focus:ring-[#4977ec30]"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onCreate()}
                />
                <p className="text-xs mt-1 text-gray-500">
                    You can change this later
                </p>
            </div>

            <div className="flex items-center justify-end gap-3">
                <Button
                    onClick={() => setShowPopup(false)}
                    disabled={loading}
                    btnText="Cancel"
                    defaultStyles={true}
                    className="bg-gray-200 hover:bg-gray-300 w-full focus:ring-gray-500 text-black px-3 h-[35px]"
                />

                <Button
                    onClick={onCreate}
                    disabled={!resumeTitle.trim() || loading}
                    defaultStyles={true}
                    className="px-3 gap-2 h-[35px] w-full border text-white border-[#4977ec]"
                    btnText={
                        loading ? (
                            <div className="flex items-center justify-center w-full">
                                <div className="size-5 fill-[#4977ec] dark:text-[#f7f7f7]">
                                    {icons.loading}
                                </div>
                            </div>
                        ) : (
                            'Create'
                        )
                    }
                />
            </div>
        </div>
    );
}
