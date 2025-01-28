import { UpdateCoverImage } from '..';

export default function UpdateCoverImagePopup({ close, reference }) {
    return (
        <div
            onClick={close}
            ref={reference}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center"
        >
            <UpdateCoverImage />
        </div>
    );
}
