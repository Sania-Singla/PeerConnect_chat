import { Loader2, PlusSquare, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Button as ComponentButton } from '@/Components';
import { Input } from '../ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from '../GlobalApi';
import { useNavigate } from 'react-router-dom';
import ResumeCardItem from '../ResumeCardItem';
import { IMAGES } from '@/Constants/constants';

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);

    const GetResumesList = () => {
        const data = GlobalApi.GetUserResumes();
        setResumes(data);
    };

    useEffect(() => GetResumesList(), []);

    const onCreate = async () => {
        if (!resumeTitle.trim()) return;

        setLoading(true);
        const uuid = uuidv4();
        const data = {
            title: resumeTitle,
            resumeId: uuid,
            userEmail: 'dummy email',
            userName: 'dummy fullname',
        };
        GlobalApi.CreateNewResume(data);
        setLoading(false);
        setOpenDialog(false);
        navigate(`/resume/${data.resumeId}/edit`);
    };

    return (
        <div className="p-4">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#f9f9f9] rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
                <div className="flex flex-col gap-6 max-w-lg relative z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Build Your Professional Resume
                    </h2>
                    <p className="text-gray-500">
                        Create tailored resumes for different roles and download
                        them in multiple formats
                    </p>

                    <ComponentButton
                        className="text-white rounded-md py-2 mt-4 flex items-center justify-center w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        onClick={() => setOpenDialog(true)}
                        btnText={
                            <div className="flex items-center gap-3">
                                <span>Create New Resume</span>
                                <PlusSquare className="w-5 h-5" />
                            </div>
                        }
                    />
                </div>

                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 max-md:hidden">
                    <img
                        src={IMAGES.resumeCover}
                        alt="resume-document"
                        width={400}
                        height={400}
                        className="animate-float"
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 opacity-15 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </section>

            {/* Resume Cards Section */}
            <section className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold">Your Resumes</h2>

                {resumes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add Resume Card */}
                        <div
                            className="h-full flex flex-col items-center justify-center gap-3 p-6 
                            border-2 border-dashed border-gray-300 rounded-xl bg-white hover:border-[#4977ec]
                            transition-all duration-300 cursor-pointer hover:shadow-md"
                            onClick={() => setOpenDialog(true)}
                        >
                            <PlusSquare className="w-10 h-10 text-[#4977ec]" />
                            <h3 className="text-lg font-medium text-gray-700">
                                Add New Resume
                            </h3>
                        </div>

                        {/* Existing Resumes */}
                        {resumes.map((resume) => (
                            <ResumeCardItem
                                resume={resume}
                                key={resume.resumeId}
                                refreshData={GetResumesList}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            No Resumes Created Yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Get started by creating your first professional
                            resume
                        </p>
                        <Button
                            className="bg-[#4977ec] hover:bg-[#3b62c2] text-white"
                            onClick={() => setOpenDialog(true)}
                        >
                            Create Resume
                        </Button>
                    </div>
                )}
            </section>

            {/* Create Resume Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-800">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#4977ec]" />
                                Create New Resume
                            </div>
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-gray-600">
                            Give your resume a title to get started
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="resume-title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Resume Title
                            </label>
                            <Input
                                id="resume-title"
                                placeholder="e.g. Senior Frontend Developer Resume"
                                className="w-full focus:border-[#4977ec] focus:ring-1 focus:ring-[#4977ec30]"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && onCreate()
                                }
                            />
                            <p className="text-xs text-gray-500">
                                You can change this later
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenDialog(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onCreate}
                            disabled={!resumeTitle.trim() || loading}
                            className="bg-[#4977ec] hover:bg-[#3b62c2] text-white gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Resume'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddResume;
