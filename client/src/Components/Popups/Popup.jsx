import { useRef } from 'react';
import {
    DeleteAccount,
    LoginPopup,
    UpdateAvatarPopup,
    UpdateCoverImagePopup,
    FriendsPopup,
    RequestsPopup,
    AddMembersPopup,
    ShowFilePopup,
} from '@/Components';
import { usePopupContext } from '@/Context';

export default function Popup() {
    const { popupInfo, setShowPopup, showPopup } = usePopupContext();
    const ref = useRef();

    function close(e) {
        if (e.target === ref.current) setShowPopup(false);
    }

    const Wrapper = ({ children }) => (
        <div
            className="fixed inset-0 z-[1000] px-10 backdrop-blur-sm flex items-center justify-center"
            ref={ref}
            onClick={close}
        >
            {children}
        </div>
    );

    if (!showPopup) return null;

    switch (popupInfo.type) {
        case 'login':
            return (
                <Wrapper>
                    <LoginPopup />
                </Wrapper>
            );
        case 'deleteAccount':
            return (
                <Wrapper>
                    <DeleteAccount />
                </Wrapper>
            );
        case 'showFile':
            return (
                <Wrapper>
                    <ShowFilePopup />
                </Wrapper>
            );
        case 'updateAvatar':
            return (
                <Wrapper>
                    <UpdateAvatarPopup />
                </Wrapper>
            );
        case 'updateCoverImage':
            return (
                <Wrapper>
                    <UpdateCoverImagePopup />
                </Wrapper>
            );
        case 'friends':
            return (
                <Wrapper>
                    <FriendsPopup />
                </Wrapper>
            );
        case 'addMembers':
            return (
                <Wrapper>
                    <AddMembersPopup />
                </Wrapper>
            );
        case 'requests':
            return (
                <Wrapper>
                    <RequestsPopup />
                </Wrapper>
            );
        default:
            return null;
    }
}
