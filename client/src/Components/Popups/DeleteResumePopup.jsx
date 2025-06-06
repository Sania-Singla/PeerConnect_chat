import { Button } from '@/Components';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { usePopupContext } from '@/Context';
import { useState } from 'react';
import { icons } from '@/Assets/icons';

export default function DeleteResumePopup() {
    const { popupInfo, setShowPopup } = usePopupContext();
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    async function deleteResume() {
        try {
            setLoading(true);
            const response = await resumeService.deleteResume(
                popupInfo.resume.resumeId
            );
            if (response.deletedCount) {
                toast.success('Resume deleted successfully');
            }
        } catch (err) {
            toast.error('Failed to delete resume');
        } finally {
            setLoading(false);
            setShowPopup(false);
        }
    }

    return (
        <div className="w-[300px] md:w-sm bg-white p-6 rounded-lg grid gap-2 shadow-sm">
            <h2 className="text-red-600 font-semibold mb-2">
                Delete this resume?
            </h2>
            <div>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                        id="check"
                        type="checkbox"
                        className="mt-1 size-5"
                        onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    <label htmlFor="check">
                        This will permanently delete{' '}
                        <strong className="text-black">
                            {popupInfo.resume.title}
                        </strong>{' '}
                        and cannot be undone.
                    </label>
                </div>
            </div>

            <div className="flex items-center justify-center gap-3 mt-3">
                <Button
                    onClick={() => setShowPopup(false)}
                    defaultStyles={true}
                    className="bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-black px-3 h-[35px] w-full"
                    btnText="Cancel"
                />
                <Button
                    onClick={deleteResume}
                    disabled={!confirmed || loading}
                    defaultStyles={true}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white px-3 h-[35px] w-full"
                    btnText={
                        loading ? (
                            <div className="flex items-center justify-center my-2 w-full">
                                <div className="size-5 fill-[white] dark:text-[#f7f7f7]">
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
