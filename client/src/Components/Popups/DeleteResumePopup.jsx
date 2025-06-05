import { Button } from '@/Components';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { usePopupContext } from '@/Context';
import { icons } from 'lucide-react';

export default function DeleteResumePopup() {
    const { popupInfo } = usePopupContext();

    async function deleteResume() {
        try {
            await resumeService.deleteResume(popupInfo.resumeId);
            toast.success('Resume deleted successfully');
        } catch (err) {
            toast.error('Failed to delete resume');
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div>
                <h2>Delete this resume?</h2>
                <p>
                    This will permanently delete "{popupInfo.resume.title}" and
                    cannot be undone.
                </p>
            </div>

            <div>
                <p>Cancel</p>
                <Button
                    onClick={deleteResume}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    btnText={
                        loading ? (
                            <div className="flex items-center justify-center my-2 w-full">
                                <div className="size-7 fill-[#4977ec] dark:text-[#f7f7f7]">
                                    {icons.loading}
                                </div>
                            </div>
                        ) : (
                            'Delete Resume'
                        )
                    }
                />
            </div>
        </div>
    );
}
