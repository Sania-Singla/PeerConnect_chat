import { Loader2, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/Components';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '@/Services';
import { usePopupContext } from '@/Context';

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
                    <label
                        htmlFor="resume-title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Resume Title
                    </label>
                    <Input
                        id="resume-title"
                        placeholder="e.g. Senior Frontend Developer Resume"
                        className="w-full focus:border-[#4977ec] focus:ring-1 focus:ring-[#4977ec30]"
                        value={resumeTitle}
                        onChange={(e) => setResumeTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onCreate()}
                    />
                    <p className="text-xs text-gray-500">
                        You can change this later
                    </p>
                </div>
            </div>

            <div>
                <Button
                    onClick={() => setOpenDialog(false)}
                    disabled={loading}
                    btnText="Cancel"
                />
                <Button
                    onClick={onCreate}
                    disabled={!resumeTitle.trim() || loading}
                    className="bg-[#4977ec] hover:bg-[#3b62c2] text-white gap-2"
                    btnText={
                        loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Resume'
                        )
                    }
                />
            </div>
        </div>
    );
}
