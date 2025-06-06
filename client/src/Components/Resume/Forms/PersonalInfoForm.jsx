import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';

export default function PersonalInfoForm({ enabledNext }) {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useResumeContext();
    const [personalInfo, setPersonalInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        // move to a util
        // if (name === 'linkedin' || name === 'github' || name === 'leetcode') {
        //     // just prompt the user to enter the username only
        //     if (
        //         value.startsWith('https://') ||
        //         value.startsWith('http://') ||
        //         value.includes('www.') ||
        //         value.includes('.com') ||
        //         value.includes('/')
        //     ) {
        //         toast.error('Please enter only the LinkedIn username.');
        //         return;
        //     }
        // }

        setPersonalInfo({ ...personalInfo, [name]: value });
        setResumeInfo({ ...resumeInfo, [name]: value });
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.updatePersonalInfo(
                resumeId,
                personalInfo
            );
            if (res && !res.message) toast.success('Personal Info updated!');
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-[#4977ec] border-t-4">
            <h2 className="font-bold text-lg">Personal Detail</h2>
            <p className="text-gray-500 text-sm italic mt-1">
                Get Started with the basic information
            </p>

            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 mt-5 gap-3">
                    <Input
                        label="First Name"
                        name="firstName"
                        defaultValue={resumeInfo?.firstName}
                        required
                        onChange={handleInputChange}
                    />

                    <Input
                        label="Last Name"
                        name="lastName"
                        required
                        onChange={handleInputChange}
                        defaultValue={resumeInfo?.lastName}
                    />
                    <div className="col-span-2">
                        <Input
                            label="Address"
                            name="address"
                            required
                            defaultValue={resumeInfo?.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Input
                            label="Phone"
                            name="phone"
                            required
                            defaultValue={resumeInfo?.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Input
                            label="Email"
                            name="email"
                            required
                            defaultValue={resumeInfo?.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            label="LinkedIn Username"
                            name="linkedin"
                            defaultValue={resumeInfo?.linkedin}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-span-2">
                        <Input
                            label="GitHub uername"
                            name="github"
                            defaultValue={resumeInfo?.github}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <Button
                        defaultStyles={true}
                        type="submit"
                        className=" px-4 py-1 text-base "
                        disabled={loading}
                        btnText={
                            loading ? (
                                <div className="flex items-center justify-center my-2 w-full">
                                    <div className="size-5 fill-[#4977ec] dark:text-[#f7f7f7]">
                                        {icons.loading}
                                    </div>
                                </div>
                            ) : (
                                'Save'
                            )
                        }
                    />
                </div>
            </form>
        </div>
    );
}
