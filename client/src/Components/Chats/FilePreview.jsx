import { icons } from '../../Assets/icons';
import { Button } from '..';
import { useUserContext } from '../../Context';
import { useNavigate } from 'react-router-dom';
import { formatFileSize } from '../../Utils';

export default function FilePreview({ attachment, senderId }) {
    const { user } = useUserContext();
    const { url, type, name, size } = attachment;
    const isSender = user.user_id === senderId;
    const navigate = useNavigate();

    const handleDownload = async () => {
        try {
            // Fetch the file as a Blob
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch the file');

            const blob = await response.blob();
            const blobURL = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobURL;
            a.download = name;
            a.click();

            URL.revokeObjectURL(blobURL);
            a.remove();
        } catch (err) {
            console.error('Error downloading the file:', err);
            navigate('/server-error');
        }
    };

    return (
        <div
            className={`max-w-[400px] overflow-hidden rounded-md ${
                isSender ? 'bg-blue-400' : 'bg-gray-300'
            }`}
        >
            {type.startsWith('video/') ? (
                <video
                    src={url}
                    controls
                    className="w-[300px] object-cover aspect-auto"
                />
            ) : type.startsWith('image/') ? (
                <img
                    src={url}
                    alt="message attachment"
                    className="object-cover w-[300px] aspect-auto"
                />
            ) : (
                <div
                    className={`aspect-auto w-full flex flex-col p-2 ${
                        isSender ? 'bg-blue-400' : 'bg-gray-300'
                    }`}
                >
                    <div className="px-1 flex-1 flex items-center gap-2">
                        <div className="pt-[5px]">
                            <div className=" size-[24px] fill-current">
                                {icons.doc}
                            </div>
                        </div>
                        <div
                            className={`overflow-hidden ${
                                isSender ? 'text-white' : 'text-gray-800'
                            }`}
                        >
                            <p className="truncate text-[13px] leading-tight">
                                {name}
                            </p>
                            <p className="text-[9px] leading-tight">
                                {formatFileSize(size)}
                            </p>
                        </div>
                    </div>

                    <hr
                        className={`border-t-[0.01rem] mt-2 mb-3 ${
                            isSender
                                ? 'border-[#ffffff4a]'
                                : 'border-[#0000004a]'
                        }`}
                    />

                    <div className="flex gap-2">
                        <Button
                            btnText="Open"
                            title="Open"
                            className={`rounded-[5px] w-full py-1 hover:scale-100 ${
                                isSender
                                    ? 'text-white bg-[#ffffff39] hover:bg-[#ffffff5b]'
                                    : 'text-gray-800 bg-[#34343425] hover:bg-[#29292924]'
                            }`}
                            onClick={() => window.open(url, '_blank')}
                        />
                        <Button
                            btnText="Save"
                            title="Download"
                            className={`rounded-[5px] w-full py-1 hover:scale-100 ${
                                isSender
                                    ? 'text-white bg-[#ffffff39] hover:bg-[#ffffff5b]'
                                    : 'text-gray-800 bg-[#34343425] hover:bg-[#29292924]'
                            }`}
                            onClick={handleDownload}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
