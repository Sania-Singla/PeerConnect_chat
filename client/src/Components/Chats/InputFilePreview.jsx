import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import { formatFileSize } from '@/Utils';

export default function InputFilePreview({
    file,
    previewURL,
    removeAttachment,
    index,
}) {
    const { size, name, type } = file;

    return (
        <div className="relative group drop-shadow-md">
            {type?.startsWith('video/') ? (
                <video
                    src={previewURL}
                    controls
                    className="aspect-auto max-w-[150px] h-fit rounded-lg object-cover"
                />
            ) : type?.startsWith('image/') ? (
                <img
                    loading="lazy"
                    src={previewURL}
                    alt="attachment preview"
                    className="aspect-auto max-w-[150px] h-fit rounded-lg object-cover"
                />
            ) : (
                <div className="aspect-auto w-[150px] h-[100px] p-2 bg-blue-500 rounded-lg text-white drop-shadow-md">
                    <div className="h-full w-full overflow-hidden bg-[#ffffff42] p-2 rounded-lg flex flex-col items-center justify-between">
                        <div className="size-[20px] fill-[#f6f6f6]">
                            {icons.doc}
                        </div>

                        <p className="text-xs w-full truncate">{name} </p>
                        <p className="text-[9px]">{formatFileSize(size)}</p>
                    </div>
                </div>
            )}

            <Button
                btnText={
                    <div className="size-[14px] stroke-white">
                        {icons.cross}
                    </div>
                }
                onClick={() => removeAttachment(index)}
                className="absolute -top-1 -right-1 bg-[#000000ed] p-1 rounded-full"
            />
        </div>
    );
}
