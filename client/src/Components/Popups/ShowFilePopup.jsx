import { usePopupContext } from '../../Context/PopupContext';

export default function ShowFilePopup() {
    const { popupInfo } = usePopupContext();

    return (
        <div className="max-w-[600px] h-[400px] drop-shadow-md">
            {popupInfo.file.type.startsWith('video/') ? (
                <video
                    src={popupInfo.file.url}
                    controls
                    className="w-full object-cover h-full rounded-lg aspect-auto"
                />
            ) : (
                <img
                    src={popupInfo.file.url}
                    alt="message attachment"
                    className="object-cover w-full h-full rounded-lg aspect-auto"
                />
            )}
        </div>
    );
}
