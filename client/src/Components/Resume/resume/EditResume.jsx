import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from './FormSection';
import ResumePreview from './ResumePreview';
import { ResumeInfoContext } from '../ResumeInfoContext';
import GlobalApi from '../GlobalApi';

function EditResume() {
    const { resumeId } = useParams();
    const [resumeInfo, setResumeInfo] = useState(null);

    useEffect(() => {
        async function fetchResume() {
            const data = await GlobalApi.GetResumeById(resumeId);
            setResumeInfo(data);
        }
        fetchResume();
    }, [resumeId]);

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div className="h-full bg-gray-50 p-4 rounded-xl">
                <div className="h-full mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Left: Form Section */}
                    <div className="h-full bg-white p-4 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Edit Your Resume Details
                        </h2>
                        <FormSection />
                    </div>

                    {/* Right: Resume Preview */}
                    <div className="h-full bg-white p-4 rounded-2xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Live Resume Preview
                        </h2>
                        <ResumePreview />
                    </div>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default EditResume;
