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
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div>
                <h2 className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#4977ec]" />
                    Create New Resume
                </h2>

                <p className="mt-2 text-gray-600">
                    Give your resume a title to get started
                </p>
            </div>

            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Input
                        label={'Resume Title'}
                        id="resume-title"
                        placeholder="e.g. Senior Frontend Developer Resume"
                        value={resumeTitle}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onCreate()}
                    />
                    <p className="text-xs text-gray-500">
                        You can change this later
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    defaultStyles={true}
                    onClick={() => setShowPopup(false)}
                    disabled={loading}
                    btnText="Cancel"
                    className="px-2 py-1"
                />
                <Button
                    defaultStyles={true}
                    onClick={onCreate}
                    disabled={!resumeTitle.trim() || loading}
                    className="px-2 py-1"
                    btnText={
                        loading ? (
                            <div className="flex items-center justify-center my-2 w-full">
                                <div className="size-5 fill-[#4977ec] dark:text-[#f7f7f7]">
                                    {icons.loading}
                                </div>
                            </div>
                        ) : (
                            'Create Resume'
                        )
                    }
                />
            </div>
        </div>
    );
}
