import { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

const PopupContextProvider = ({ children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupInfo, setPopupInfo] = useState({ type: '', content: '' });
    const [showToast, setShowToast] = useState(false);
    const [toastContent, setToastContent] = useState('');

    return (
        <PopupContext.Provider
            value={{
                showPopup,
                popupInfo,
                setPopupInfo,
                setShowPopup,
                showToast,
                setShowToast,
                toastContent,
                setToastContent,
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

const usePopupContext = () => useContext(PopupContext);

export { usePopupContext, PopupContextProvider };
