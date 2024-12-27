import { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

const PopupContextProvider = ({ children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState('');
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [loginPopupText, setLoginPopupText] = useState('');

    return (
        <PopupContext.Provider
            value={{
                showPopup,
                popupText,
                showLoginPopup,
                loginPopupText,
                setShowPopup,
                setPopupText,
                setShowLoginPopup,
                setLoginPopupText,
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

function usePopupContext() {
    return useContext(PopupContext);
}

export { usePopupContext, PopupContextProvider };
