import { Button } from '@/Components';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { usePopupContext } from '@/Context';
import { icons } from 'lucide-react';
import { useState } from 'react';

export default function DeleteResumePopup() {
    const { popupInfo, setShowPopup } = usePopupContext();
    const [loading, setLoading] = useState(false);

    async function deleteResume() {
        try {
            setLoading(true);
            await resumeService.deleteResume(popupInfo.resumeId);
            toast.success('Resume deleted successfully');
        } catch (err) {
            toast.error('Failed to delete resume');
        } finally {
            setLoading(false);
            setShowPopup(false);
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

            <div className="flex items-center justify-center gap-3 mt-3">
                <Button
                    onClick={() => setShowPopup(false)}
                    defaultStyles={true}
                    className="bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-black px-3 py-1"
                    btnText="Cancel"
                />
                <Button
                    onClick={deleteResume}
                    disabled={loading}
                    defaultStyles={true}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white px-3 py-1"
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
