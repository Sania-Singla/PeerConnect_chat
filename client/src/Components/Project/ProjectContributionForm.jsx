import { useState } from 'react';
import { authService } from '@/Services';
import { useUserContext } from '@/Context';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/Components';
import { verifyExpression, fileRestrictions } from '@/Utils';
import { LOGO, MAX_FILE_SIZE } from '@/Constants/constants';
import { motion } from 'framer-motion';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';

export default function ProjectContributionForm() {
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        avatar: null,
        coverImage: null,
        githubProfile: '',
        channelProfile: '',
        techStack: '',
        experienceLevel: '',
        purpose: ''
    });
    const [error, setError] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleFileChange(e) {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];

            if (!fileRestrictions(file)) {
                return toast.error(
                    `only png, jpg/jpeg files are allowed and File size should not exceed ${MAX_FILE_SIZE} MB.`
                );
            }

            setInputs((prev) => ({ ...prev, [name]: file }));
        } else {
            name === 'avatar'
                ? setError((prevError) => ({
                      ...prevError,
                      avatar: 'avatar is required.',
                  }))
                : setError((prevError) => ({ ...prevError, avatar: '' }));
        }
    }

    const handleBlur = (e) => {
        let { name, value } = e.target;
        if (value) verifyExpression(name, value, setError);
    };

    function onMouseOver() {
        if (
            Object.entries(inputs).some(
                ([key, value]) =>
                    !value && key !== 'coverImage' && key !== 'lastName' && key !== 'channelProfile'
            ) ||
            Object.entries(error).some(
                ([key, value]) => value !== '' && key !== 'root'
            )
        ) {
            setDisabled(true);
        } else setDisabled(false);
    }

    const inputFields = [
        {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            placeholder: 'First name',
            required: true,
            className: 'w-full md:w-1/2 pr-2'
        },
        {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            placeholder: 'Last name (optional)',
            required: false,
            className: 'w-full md:w-1/2'
        },
        {
            type: 'email',
            name: 'email',
            label: 'Email',
            placeholder: 'your@email.com',
            required: true,
            className: 'w-full'
        },
        {
            type: 'url',
            name: 'githubProfile',
            label: 'GitHub',
            placeholder: 'github.com/username',
            required: false,
            className: 'w-full md:w-1/2 pr-2'
        },
        {
            type: 'url',
            name: 'channelProfile',
            label: 'Channel',
            placeholder: 'peer-connect/username',
            required: false,
            className: 'w-full md:w-1/2'
        },
        {
            type: 'text',
            name: 'techStack',
            label: 'Tech Stack',
            placeholder: 'React, Node.js, Python etc.',
            required: true,
            className: 'w-full'
        },
        {
            type: 'select',
            name: 'experienceLevel',
            label: 'Experience Level',
            options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            required: true,
            className: 'w-full'
        },
        {
            type: 'textarea',
            name: 'purpose',
            label: 'Purpose for Joining',
            placeholder: 'Why you want to contribute to this project...',
            required: true,
            className: 'w-full'
        },
    ];

    const inputElements = inputFields.map((field) => (
        <div key={field.name} className={`mb-3 ${field.className}`}>
            <div className="bg-white z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                <label htmlFor={field.name}>
                    {field.required && <span className="text-red-500">* </span>}
                    {field.label}:
                </label>
            </div>
            <div className="relative">
                {field.type === 'textarea' ? (
                    <textarea
                        name={field.name}
                        id={field.name}
                        value={inputs[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field.placeholder}
                        className="shadow-md shadow-[#f7f7f7] py-[15px] rounded-[5px] pl-[10px] w-full border-[0.01rem] border-gray-500 bg-transparent min-h-[100px]"
                        rows="4"
                    />
                ) : field.type === 'select' ? (
                    <select
                        name={field.name}
                        id={field.name}
                        value={inputs[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="shadow-md shadow-[#f7f7f7] py-[15px] rounded-[5px] pl-[10px] w-full border-[0.01rem] border-gray-500 bg-transparent"
                    >
                        <option value="">Select experience level</option>
                        {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={field.type}
                        name={field.name}
                        id={field.name}
                        value={inputs[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={field.placeholder}
                        className="shadow-md shadow-[#f7f7f7] py-[15px] rounded-[5px] pl-[10px] w-full border-[0.01rem] border-gray-500 bg-transparent"
                    />
                )}
            </div>
            {error[field.name] && (
                <div className="mt-1 text-red-500 text-sm font-medium">
                    {error[field.name]}
                </div>
            )}
        </div>
    ));

    return (
        <div className="max-w-3xl mb-6 mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Project Contribution Form</h2>
            <form >
                <div className="flex flex-wrap -mx-2">
                    {inputElements}
                </div>
                <div className="mt-4">
                    <Button
                        type="submit"
                        disabled={disabled}
                        onMouseOver={onMouseOver}
                        btnText={"Submit Contributor Request"}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg  font-semibold py-3 px-4 rounded-md transition duration-200"
                    >
                        {loading ? 'Submitting...' : 'Submit Contribution Request'}
                    </Button>
                </div>
            </form>
        </div>
    );
}