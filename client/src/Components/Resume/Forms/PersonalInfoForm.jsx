import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';
import { verifyUserName } from '@/Utils/regex';

export default function PersonalInfoForm() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo, setEnableNext } = useResumeContext();
    const [personalInfo, setPersonalInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo({ ...personalInfo, [name]: value });
        setResumeInfo({ ...resumeInfo, [name]: value });
    };

    function handleBlur(e) {
        const { name, value } = e.target;
        verifyUserName(name, value);
    }
    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.updatePersonalInfo(
                resumeId,
                personalInfo
            );
            if (res && !res.message) {
                toast.success('Personal Info updated!');
                setEnableNext(true);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 shadow-sm rounded-lg border-t-[#4977ec] border-t-4 border border-gray-200">
            <h2 className="font-bold text-lg">Personal Detail</h2>
            <p className="text-gray-400 text-sm italic mt-1">
                Get Started with the basic information
            </p>

            <form onSubmit={onSave}>
                <div className="grid grid-cols-2 mt-5 gap-5">
                    <Input
                        label="First Name"
                        name="firstName"
                        defaultValue={resumeInfo?.firstName}
                        required
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. John"
                    />

                    <Input
                        label="Last Name"
                        name="lastName"
                        required
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        defaultValue={resumeInfo?.lastName}
                        placeholder="e.g. Doe"
                    />

                    <Input
                        label="State"
                        name="state"
                        required
                        defaultValue={resumeInfo?.address}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Chandigarh"
                    />
                    <Input
                        label="Country"
                        name="country"
                        required
                        defaultValue={resumeInfo?.address}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. India"
                    />

                    <Input
                        label="Phone"
                        name="phone"
                        required
                        defaultValue={resumeInfo?.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. +91 2345678901"
                    />

                    <Input
                        label="Email"
                        name="email"
                        required
                        defaultValue={resumeInfo?.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. john.doe@example.com"
                    />

                    <Input
                        label="LinkedIn Username"
                        name="linkedin"
                        defaultValue={resumeInfo?.linkedin}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. john-doe"
                    />

                    <Input
                        label="GitHub Username"
                        name="github"
                        defaultValue={resumeInfo?.github}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g. johndoe123"
                    />
                </div>

                <div className="mt-5 flex justify-end">
                    <Button
                        defaultStyles={true}
                        type="submit"
                        className="py-[5px] w-[60px] text-[15px] text-white "
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
