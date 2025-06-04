import { useState } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Summery from './forms/Summary';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import Achievements from './forms/Achievements';
import { Navigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';

function FormSection() {
    const [activeFormIndex, setActiveFormIndex] = useState(1);
    const [enableNext, setEnableNext] = useState(true);
    const { resumeId } = useParams();

    const forms = [
        {
            title: 'Personal Details',
            component: <PersonalDetail enabledNext={setEnableNext} />,
        },
        {
            title: 'Summary',
            component: <Summery enabledNext={setEnableNext} />,
        },
        { title: 'Experience', component: <Experience /> },
        { title: 'Education', component: <Education /> },
        { title: 'Skills', component: <Skills /> },
        { title: 'Achievements', component: <Achievements /> },
    ];

    return (
        <div className="h-full">
            {/* Header Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <ThemeColor />

                {/* Progress Stepper */}
                <div className="flex items-center gap-1 overflow-x-auto py-2">
                    {forms.map((form, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <button
                                onClick={() => setActiveFormIndex(index + 1)}
                                className={`flex items-center cursor-pointer justify-center size-7 rounded-full text-sm font-medium 
                                    ${
                                        activeFormIndex === index + 1
                                            ? 'bg-[#4977ec] text-white'
                                            : 'bg-white border border-[#4977ec20] text-[#555555]'
                                    }`}
                            >
                                {index + 1}
                            </button>
                            {index < forms.length - 1 && (
                                <div className="w-5 h-[1px] bg-[#4977ec30]"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl mb-6">
                {forms[activeFormIndex - 1]?.component || (
                    <Navigate to={`/resume/${resumeId}/view`} />
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
                <div>
                    {activeFormIndex > 1 && (
                        <Button
                            variant="outline"
                            className="border-[#4977ec] hover:bg-[#4977ec10] text-[#4977ec] gap-2"
                            onClick={() =>
                                setActiveFormIndex(activeFormIndex - 1)
                            }
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Previous
                        </Button>
                    )}
                </div>
                <Button
                    className={`bg-[#4977ec] hover:bg-[#3b62c2] text-white gap-2 
                        ${!enableNext ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={() => setActiveFormIndex(activeFormIndex + 1)}
                    disabled={!enableNext}
                >
                    {activeFormIndex < forms.length ? (
                        <>
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </>
                    ) : (
                        'Finish & Preview'
                    )}
                </Button>
            </div>
        </div>
    );
}

export default FormSection;
