import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ResumeInfoContext } from '../../ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../GlobalApi';
import { toast } from 'react-hot-toast';

function PersonalDetail({ enabledNext }) {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        if (name === 'linkedin' || name === 'github' || name === 'leetcode') {
            // just prompt the user to enter the username only
            if (
                value.startsWith('https://') ||
                value.startsWith('http://') ||
                value.includes('www.') ||
                value.includes('.com') ||
                value.includes('/')
            ) {
                toast.error('Please enter only the LinkedIn username.');
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: value,
        });
        setResumeInfo({
            ...resumeInfo,
            [name]: value,
        });
    };

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true);
        GlobalApi.UpdateResumeDetail(resumeId, {
            ...formData,
            themeColor: resumeInfo?.themeColor || '#4977ec',
        });
        enabledNext(true);
        setLoading(false);
        toast.success('Details updated');
    };
    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Personal Detail</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Get Started with the basic information
            </p>

            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 mt-5 gap-3">
                    <div>
                        <label className="text-sm font-medium">
                            First Name
                        </label>
                        <Input
                            name="firstName"
                            defaultValue={resumeInfo?.firstName}
                            required
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                            name="lastName"
                            required
                            onChange={handleInputChange}
                            defaultValue={resumeInfo?.lastName}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Job Title</label>
                        <Input
                            name="jobTitle"
                            required
                            defaultValue={resumeInfo?.jobTitle}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Address</label>
                        <Input
                            name="address"
                            required
                            defaultValue={resumeInfo?.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Phone</label>
                        <Input
                            name="phone"
                            required
                            defaultValue={resumeInfo?.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            name="email"
                            required
                            defaultValue={resumeInfo?.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">
                            LinkedIn Username
                        </label>
                        <Input
                            name="linkedin"
                            defaultValue={resumeInfo?.linkedin}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">
                            GitHub Username
                        </label>
                        <Input
                            name="github"
                            defaultValue={resumeInfo?.github}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <Button
                        type="submit"
                        className="border-white border-1 rounded-lg px-6 text-base bg-[#4977ec] text-white"
                        disabled={loading}
                    >
                        {loading ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PersonalDetail;
