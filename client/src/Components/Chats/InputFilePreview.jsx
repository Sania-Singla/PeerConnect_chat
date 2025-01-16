import { icons } from '../../Assets/icons';
import { Button } from '..';

export default function InputFilePreview({
    file,
    previewURL,
    removeAttachment,
    index,
}) {
    if (file?.type?.startsWith('video/')) {
        return (
            <div className="relative group min-w-[150px] drop-shadow-md">
                <video
                    src={previewURL}
                    controls
                    className="w-full aspect-[1.618] rounded-lg object-cover"
                />
                <Button
                    btnText="&times;"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100"
                />
            </div>
        );
    } else if (file?.type?.startsWith('image/')) {
        return (
            <div className="relative group min-w-[150px] drop-shadow-md">
                <img
                    src={previewURL}
                    alt="attachment preview"
                    className="w-full aspect-[1.618] rounded-lg object-cover"
                />
                <Button
                    btnText="&times;"
                    onClick={() => removeAttachment(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100"
                />
            </div>
        );
    } else {
        return (
            <div className="relative aspect-[1.618] min-w-[150px] text-white rounded-lg p-2 bg-blue-500 drop-shadow-md">
                <div className="h-full p-2 bg-[#ffffff42] rounded-lg flex flex-col items-center justify-center">
                    <div className="w-full flex items-center justify-center gap-1">
                        <div className="size-[25px] fill-[#f6f6f6]">
                            {icons.doc}
                        </div>
                        <p className="text-sm max-w-[80px] truncate">
                            {file?.name}
                        </p>
                    </div>

                    <div className="w-full text-xs text-center text-gray-100">
                        {(file?.size / (1024 * 1024)).toPrecision(2)} MB
                    </div>
                </div>
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
}
