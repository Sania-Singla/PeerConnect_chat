import { icons } from '../../Assets/icons';
import { Button } from '..';
import { useUserContext } from '../../Context';

export default function FilePreview({ attachment, fileName, senderId }) {
    const extension = attachment?.split('.').pop();
    const fileType = attachment?.split('/')[4];
    const { user } = useUserContext();
    const isSender = user.user_id === senderId;

    const handleDownload = () => {
        const anchor = document.createElement('a');
        anchor.href = attachment; // URL of the file
        anchor.download = attachment; // provided fileName
        anchor.click();
    };

    return (
        <div
            className={`w-full overflow-hidden rounded-lg mb-2 ${
                isSender ? 'bg-blue-400' : 'bg-gray-300'
            }`}
        >
            {fileType === 'video' ? (
                <video
                    src={attachment}
                    controls
                    className="w-full aspect-[1.618] h-full object-cover"
                />
            ) : fileType === 'image' && extension !== 'pdf' ? (
                <img
                    src={attachment}
                    alt="message attachment"
                    className="object-cover w-full aspect-[1.618] h-full"
                />
            ) : (
                <div
                    className={`w-[376px] flex flex-col p-[12px] pt-[8px] ${
                        isSender ? 'bg-blue-400' : 'bg-gray-300'
                    }`}
                >
                    <div className="h-[35px] flex items-center justify-start gap-2">
                        <div className="size-[25px] stroke-current fill-none">
                            {icons.doc}
                        </div>
                        <p
                            className={`line-clamp-1 text-lg ${
                                isSender ? 'text-white' : 'text-gray-800'
                            }`}
                        >
                            {fileName}
                        </p>
                    </div>

                    <hr
                        className={`border-t-[0.01rem] mt-2 mb-3 ${
                            isSender
                                ? 'border-[#ffffff4a]'
                                : 'border-[#0000004a]'
                        }`}
                    />

                    <div className="flex gap-4 h-[35px]">
                        <Button
                            btnText="Open"
                            title="Open"
                            className={`rounded-md py-[5px] w-full h-full ${
                                isSender
                                    ? 'text-white bg-[#ffffff39] hover:bg-[#ffffff33]'
                                    : 'text-gray-800 bg-[#34343425] hover:bg-[#29292924]'
                            }`}
                            onClick={() => {
                                window.open(attachment);
                            }}
                        />
                        <Button
                            btnText="Save"
                            title="Download"
                            className={`rounded-md py-[5px] w-full h-full ${
                                isSender
                                    ? 'text-white bg-[#ffffff39] hover:bg-[#ffffff33]'
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
