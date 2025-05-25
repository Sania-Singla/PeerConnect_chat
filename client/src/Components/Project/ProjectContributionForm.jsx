import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';

export default function ProjectContributionForm() {
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

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const inputFields = [
        {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            placeholder: 'John',
            required: true,
            className: 'md:col-span-1',
        },
        {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            placeholder: 'Doe (optional)',
            required: false,
            className: 'md:col-span-1',
        },
        {
            type: 'email',
            name: 'email',
            label: 'Email Address',
            placeholder: 'your.email@example.com',
            required: true,
            className: 'md:col-span-2',
        },
        {
            type: 'url',
            name: 'githubProfile',
            label: 'GitHub Profile',
            placeholder: 'https://github.com/username',
            required: false,
            className: 'md:col-span-1',
            icon: icons.github,
        },
        {
            type: 'url',
            name: 'channelProfile',
            label: 'Your Profile Link',
            placeholder: 'https://peer-connect.dev/yourprofile',
            required: false,
            className: 'md:col-span-1',
            icon: icons.link,
        },
        {
            type: 'text',
            name: 'techStack',
            label: 'Technical Skills',
            placeholder: 'React, Node.js, Python, etc.',
            required: true,
            className: 'md:col-span-2',
            description: 'Separate skills with commas',
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
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (error[name]) setError((prev) => ({ ...prev, [name]: '' }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
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

                    <form className="space-y-6">
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
                                            rows={field.rows || 4}
                                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder={field.placeholder}
                                        />
                                    ) : field.type === 'select' ? (
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={inputs[field.name]}
                                            onChange={handleChange}
                                            className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200"
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
                                                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder={field.placeholder}
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

                                    {error[field.name] && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {error[field.name]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                btnText={'Submit Application'}
                                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
