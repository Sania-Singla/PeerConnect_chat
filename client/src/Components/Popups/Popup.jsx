import { useRef } from 'react';
import {
    DeleteAccount,
    LoginPopup,
    UpdateAvatarPopup,
    UpdateCoverImagePopup,
} from '..';
import { usePopupContext } from '../../Context';

export default function Popup() {
    const { popupInfo, setShowPopup, showPopup } = usePopupContext();
    const ref = useRef();

    function close(e) {
        if (e.target === ref.current) setShowPopup(false);
    }

    if (showPopup) {
        switch (popupInfo.type) {
            case 'login':
                return <LoginPopup close={close} reference={ref} />;
            case 'deleteAccount':
                return <DeleteAccount close={close} reference={ref} />;
            case 'updateAvatar':
                return <UpdateAvatarPopup close={close} />;
            case 'updateCoverImage':
                return <UpdateCoverImagePopup close={close} />;
            default:
                return null;
        }
    }
}
