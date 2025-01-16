import { icons } from '../../Assets/icons';
import { Button } from '..';
import { useUserContext } from '../../Context';

export default function FilePreview({ attachment, senderId }) {
    const { user } = useUserContext();
    const extension = attachment?.split('.').pop();
    const fileType = attachment?.split('/')[4];
    const fileName = attachment?.split('/').pop();
    const isSender = user.user_id === senderId;

    const handleDownload = () => {
        const anchor = document.createElement('a');
        // anchor.href = attachment;
        anchor.download = attachment;
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
                    className={`flex flex-col p-3 pt-2 ${
                        isSender ? 'bg-blue-400' : 'bg-gray-300'
                    }`}
                >
                    <div className="h-[35px] flex items-center gap-2">
                        <div className="w-[25px] h-[25px] fill-current">
                            {icons.doc}
                        </div>
                        <div
                            className={`w-[calc(100%-30px)] ${
                                isSender ? 'text-white' : 'text-gray-800'
                            }`}
                        >
                            <p className="line-clamp-1 text-sm leading-tight">
                                {fileName}
                            </p>
                            <p className="line-clamp-1 text-xs leading-tight relative -top-[2px]">
                                {'filesize'} &bull; {extension}
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

                    <div className="flex gap-3 h-[35px] w-full">
                        <Button
                            btnText="Open"
                            title="Open"
                            className={`rounded-md w-full h-full ${
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
                            className={`rounded-md w-full h-full ${
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
