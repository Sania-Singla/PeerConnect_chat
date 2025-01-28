import { UpdateAvatar } from '..';

export default function UpdateAvatarPopup({ close, reference }) {
    return (
        <div
            onClick={close}
            ref={reference}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center"
        >
            <UpdateAvatar />
        </div>
    );
}
