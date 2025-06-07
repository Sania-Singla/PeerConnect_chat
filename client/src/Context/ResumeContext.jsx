import { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

const ResumeContextProvider = ({ children }) => {
    const [resumeInfo, setResumeInfo] = useState({
        experience: [
            {
                position: '',
                company: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ],
        education: [
            {
                institution: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ],
        projects: [
            {
                title: '',
                description: '',
                technologies: '',
                link: '',
            },
        ],
        achievements: [{ title: '', description: '', date: '' }],
        skills: [{ name: '', rating: 0 }],
    });
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
