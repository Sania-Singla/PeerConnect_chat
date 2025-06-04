import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProjectContributionForm() {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        githubProfile: '',
        channelProfile: '',
        techStack: '',
        experienceLevel: '',
        purpose: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const inputFields = [
        {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            placeholder: 'John',
            required: true,
            className: 'md:col-span-1',
            pattern: '^[A-Za-z]+$',
            errorMessage: 'Only letters are allowed',
        },
        {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            placeholder: 'Doe (optional)',
            required: false,
            className: 'md:col-span-1',
            pattern: '^[A-Za-z]*$',
            errorMessage: 'Only letters are allowed',
        },
        {
            type: 'email',
            name: 'email',
            label: 'Email Address',
            placeholder: 'your.email@example.com',
            required: true,
            className: 'md:col-span-2',
            errorMessage: 'Please enter a valid email',
        },
        {
            type: 'url',
            name: 'githubProfile',
            label: 'GitHub Profile',
            placeholder: 'https://github.com/username',
            required: false,
            className: 'md:col-span-1',
            icon: icons.github,
            pattern: '^(https?:\\/\\/)?(www\\.)?github\\.com\\/.+$',
            errorMessage: 'Please enter a valid GitHub URL',
        },
        {
            type: 'url',
            name: 'channelProfile',
            label: 'Your Profile Link',
            placeholder: 'https://peer-connect.dev/yourprofile',
            required: false,
            className: 'md:col-span-1',
            icon: icons.link,
            pattern: '^(https?:\\/\\/).+$',
            errorMessage: 'Please enter a valid URL',
        },
        {
            type: 'text',
            name: 'techStack',
            label: 'Technical Skills',
            placeholder: 'React, Node.js, Python, etc.',
            required: true,
            className: 'md:col-span-2',
            description: 'Separate skills with commas',
            errorMessage: 'Please list your technical skills',
        },
        {
            type: 'select',
            name: 'experienceLevel',
            label: 'Experience Level',
            options: [
                'Select your level',
                'Beginner',
                'Intermediate',
                'Advanced',
                'Expert',
            ],
            required: true,
            className: 'md:col-span-2',
            errorMessage: 'Please select your experience level',
        },
        {
            type: 'textarea',
            name: 'purpose',
            label: 'Contribution Purpose',
            placeholder:
                'Explain why you want to contribute and what skills you bring...',
            required: true,
            className: 'md:col-span-2',
            rows: 5,
            minLength: 10,
        },
    ];

    //extra checks
    const validateField = (name, value) => {
        const field = inputFields.find((f) => f.name === name);
        if (!field) return '';

        if (field.required && !value.trim() && field.type!=="select") {
            return 'This field is required';
        }

        if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
            return field.errorMessage;
        }

        if (field.minLength && value.length < field.minLength) {
            return field.errorMessage;
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));

        // Validate on change but only if the field has been touched or has an error
        if (
            errors[name] ||
            (e.target instanceof HTMLInputElement && e.target.value)
        ) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        inputFields.forEach((field) => {
            if (field.required || inputs[field.name]) {
                const error = validateField(field.name, inputs[field.name]);
                if (error) {
                    newErrors[field.name] = error;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success('Application submitted successfully!', {
                duration: 4000,
                icon: '🎉',
                position: 'top-center',
            });

            setIsSubmitted(true);
            setInputs({
                firstName: '',
                lastName: '',
                email: '',
                githubProfile: '',
                channelProfile: '',
                techStack: '',
                experienceLevel: '',
                purpose: '',
            });
        } catch (error) {
            toast.error('Submission failed. Please try again.', {
                duration: 4000,
                position: 'top-center',
            });
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto px-4 sm:px-6"
            >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 sm:p-8 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h2 className="mt-3 text-2xl font-bold text-gray-900">
                            Thank You!
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Your application has been submitted successfully.
                        </p>
                        <p className="mt-2 text-gray-600">
                            We'll review your information and get back to you
                            soon.
                        </p>
                        <div className="mt-6">
                            <Button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    navigate(`/project/${projectId}`);
                                }}
                                btnText={'Go to Project'}
                                className="py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-8xl mx-auto"
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Join Our Project
                        </h1>
                        <p className="mt-3 text-gray-600">
                            We're excited you want to contribute! Please fill
                            out this form.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        noValidate
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {inputFields.map((field) => (
                                <div
                                    key={field.name}
                                    className={`${field.className} space-y-2`}
                                >
                                    <label
                                        htmlFor={field.name}
                                        className="block text-sm font-medium text-gray-800"
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        )}
                                    </label>

                                    {field.type === 'textarea' ? (
                                        <textarea
                                            id={field.name}
                                            name={field.name}
                                            value={inputs[field.name]}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            rows={field.rows || 4}
                                            className={`mt-1 block w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            minLength={field.minLength}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`mt-1 block w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200`}
                                            required={field.required}
                                        >
                                            {field.options.map((option, i) => (
                                                <option
                                                    key={i}
                                                    value={option}
                                                    disabled={i === 0}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type={field.type}
                                                id={field.name}
                                                name={field.name}
                                                value={inputs[field.name]}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={`mt-1 block w-full px-4 py-3 border ${errors[field.name] ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                pattern={field.pattern}
                                            />
                                            {field.icon && (
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none h-4 w-4">
                                                    {field.icon}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {field.description && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {field.description}
                                        </p>
                                    )}

                                    {errors[field.name] && (
                                        <p className="text-sm text-red-600 mt-1 animate-pulse">
                                            {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                btnText={
                                    loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Submit Application'
                                    )
                                }
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
