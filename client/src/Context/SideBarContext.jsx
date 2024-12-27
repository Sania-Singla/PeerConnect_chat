import { createContext, useContext, useState } from 'react';

const SideBarContext = createContext();

const SideBarContextProvider = ({ children }) => {
    const [showSideBar, setShowSideBar] = useState(false);

    return (
        <SideBarContext.Provider value={{ showSideBar, setShowSideBar }}>
            {children}
        </SideBarContext.Provider>
    );
};

function useSideBarContext() {
    return useContext(SideBarContext);
}

export { useSideBarContext, SideBarContextProvider };
