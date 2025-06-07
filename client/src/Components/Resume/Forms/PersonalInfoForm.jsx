import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resumeService } from '@/Services';
import { useResumeContext } from '@/Context';
import Input from '@/Components/General/Input';
import { verifyUserName } from '@/Utils/regex';

export default function PersonalInfoForm() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo, setEnableNext } = useResumeContext();
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (!verifyUserName(name, value)) {
            toast.error('Invalid Username');
            return;
        }

        if (name === 'state' || name === 'country') {
            setResumeInfo((prev) => ({
                ...prev,
                personal: {
                    ...prev.personal,
                    address: { ...prev.personal.address, [name]: value },
                },
            }));
            return;
        } else {
            setResumeInfo((prev) => ({
                ...prev,
                personal: { ...prev.personal, [name]: value },
            }));
        }
    };

    async function onSave(e) {
        try {
            e.preventDefault();
            setLoading(true);
            const res = await resumeService.saveSection(
                'personal',
                resumeId,
                resumeInfo.personal
            );
            if (res && !res.message) {
                toast.success('Personal Info updated!');
                setEnableNext(true);
            }
        } catch (err) {
            toast.error('Failed to update personal info');
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
                        value={resumeInfo?.personal?.firstName}
                        required
                        onChange={handleInputChange}
                        placeholder="e.g. John"
                    />

                    <Input
                        label="Last Name"
                        name="lastName"
                        required
                        onChange={handleInputChange}
                        value={resumeInfo?.personal?.lastName}
                        placeholder="e.g. Doe"
                    />

                    <Input
                        label="State"
                        name="state"
                        required
                        value={resumeInfo?.personal?.address?.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Chandigarh"
                    />
                    <Input
                        label="Country"
                        name="country"
                        required
                        value={resumeInfo?.personal?.address?.country}
                        onChange={handleInputChange}
                        placeholder="e.g. India"
                    />

                    <Input
                        label="Phone"
                        name="phone"
                        required
                        value={resumeInfo?.personal?.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 2345678901"
                    />

                    <Input
                        label="Email"
                        name="email"
                        required
                        value={resumeInfo?.personal?.email}
                        onChange={handleInputChange}
                        placeholder="e.g. john.doe@example.com"
                    />

                    <Input
                        label="LinkedIn Username"
                        name="linkedin"
                        value={resumeInfo?.personal?.linkedin}
                        onChange={handleInputChange}
                        placeholder="e.g. john-doe"
                    />

                    <Input
                        label="GitHub Username"
                        name="github"
                        value={resumeInfo?.personal?.github}
                        onChange={handleInputChange}
                        placeholder="e.g. johndoe123"
                    />
                </div>

                <div className="mt-5 flex justify-end">
                    <Button
                        defaultStyles={true}
                        type="submit"
                        className="h-[30px] w-[60px] text-[15px] text-white "
                        disabled={loading}
                        btnText={
                            loading ? (
                                <div className="flex items-center justify-center w-full">
                                    <div className="size-4 fill-[#4977ec] dark:text-[#f7f7f7]">
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
