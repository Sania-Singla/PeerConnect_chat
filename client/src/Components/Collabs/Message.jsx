import { useUserContext } from '../../Context';
import { Button } from '..';
import { icons } from '../../Assets/icons';

export default function Message({ message }) {
    const { user } = useUserContext();
    const { sender_id, text, attachment, fileName, message_createdAt } =
        message;

    const extension = attachment?.split('.').pop();
    const fileType = attachment?.split('/')[4];
    const isSender = sender_id === user.user_id;

    const handleDownload = () => {
        const anchor = document.createElement('a');
        anchor.href = attachment; // URL of the file
        anchor.download = attachment || 'download'; // Use provided fileName or fallback to 'download'
        anchor.click();
    };

    return (
        <div
            className={`flex ${
                isSender ? 'justify-end pl-10' : 'justify-start pr-10'
            }`}
        >
            {/* Message Bubble */}
            <div
                className={`max-w-[400px] w-fit p-[12px] pb-[6px] rounded-lg shadow ${
                    isSender
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                }`}
            >
                {attachment && (
                    <div className="w-full overflow-hidden rounded-lg mb-2 bg-blue-500">
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
                            <div className="w-[376px] bg-[#ffffff42] flex flex-col p-[12px] pt-[8px]">
                                <div className="h-[35px] flex items-center justify-start gap-2">
                                    <div className="size-[25px] stroke-[#f6f6f6] fill-none">
                                        {icons.doc}
                                    </div>
                                    <p className="line-clamp-1 text-lg">
                                        {fileName}
                                    </p>
                                </div>

                                <hr className="border-t-[0.01rem] mt-2 mb-3 border-[#ffffff4a]" />

                                <div className="flex gap-4 h-[35px]">
                                    <Button
                                        btnText="Open"
                                        title="Open"
                                        className="text-white rounded-md py-[5px] w-full h-full bg-[#ffffff39] hover:bg-[#ffffff58]"
                                        onClick={() => {
                                            window.open(attachment);
                                        }}
                                    />
                                    <Button
                                        btnText="Save"
                                        title="Download"
                                        className="text-white rounded-md py-[5px] w-full h-full bg-[#ffffff4d] hover:bg-[#ffffff58]"
                                        onClick={handleDownload}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <p className="leading-3 text-lg">{text}</p>
                <p className="text-end text-xs mt-2 text-[#ffffffbf]">
                    {new Date(message_createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}

// const { sender_id, text, attachment, fileType, message_createdAt } =
//     message;

// const
// if(fileType) {
//     fileType = attachment.split("/")[4];
// } else if(attachmentPreview)
//     fileType = attachment.type
// }
