import { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

const ResumeContextProvider = ({ children }) => {
    const [resumeInfo, setResumeInfo] = useState({});
    const [enableNext, setEnableNext] = useState(false);

    return (
        <ResumeContext.Provider
            value={{ resumeInfo, setResumeInfo, enableNext, setEnableNext }}
        >
            {children}
        </ResumeContext.Provider>
    );
};

const useResumeContext = () => useContext(ResumeContext);

export { useResumeContext, ResumeContextProvider };
