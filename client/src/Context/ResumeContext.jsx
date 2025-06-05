import { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

const ResumeContextProvider = ({ children }) => {
    const [ResumeInfo, setResumeInfo] = useState(null);

    return (
        <ResumeContext.Provider value={{ ResumeInfo, setResumeInfo }}>
            {children}
        </ResumeContext.Provider>
    );
};

const useResumeContext = () => useContext(ResumeContext);

export { useResumeContext, ResumeContextProvider };
