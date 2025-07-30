import { Link } from 'react-router-dom';
import { Button } from '@/Components';
import { useState } from 'react';
import { icons } from '@/Assets/icons';
import { CONTACTS } from '@/Constants/constants';
import toast from 'react-hot-toast';

export default function ContactUsPage() {
    const [inputs, setInputs] = useState({ email: '', feedback: '' });

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function submitFeedback(e) {
        e.preventDefault();
        if (!inputs.email || !inputs.feedback) {
            toast.error('Please fill all required fields');
            return;
        }
        setInputs({ feedback: '', email: '' });
        toast.success('Feedback Submitted Successfully 🤗');
    }

    function copyEmail() {
        window.navigator.clipboard.writeText(CONTACTS.email);
        toast.success('Email Copied to Clipboard 🤗');
    }

    function callNumber() {
        window.location.href = `tel:${CONTACTS.phone}`;
    }

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4">
            {/* Hero Section */}
            <section className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Contact Us
                </h1>
                <p className="text-[15px] text-gray-600 max-w-3xl mx-auto">
                    We're here to help you make the most of your experience!
                    Whether you have feedback, need support, or are looking for
                    guidance, our team is ready to assist you.
                </p>
            </section>

            <div className="flex flex-col lg:flex-row gap-5">
                {/* Left Column - Support Info */}
                <div className="flex-1 space-y-5">
                    {/* Technical Support Card */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-xl pb-1">👥</div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Technical Support
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-3 text-[15px]">
                            Need help navigating{' '}
                            <Link
                                to="/"
                                className="text-[#4977ec] hover:underline font-medium"
                            >
                                Peer Connect
                            </Link>{' '}
                            or having technical issues?
                        </p>
                        <Link
                            to="/support"
                            className="inline-flex items-center text-[#4977ec] hover:brightness-75 font-medium"
                        >
                            Visit Support Page
                            <span className="ml-1">→</span>
                        </Link>
                    </div>

                    {/* FAQs Card */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="text-xl">📚</div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                FAQs
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-3 hover:brightness-75">
                            Find answers to common questions in our
                            comprehensive FAQ section.
                        </p>
                        <Link
                            to="/faqs"
                            className="inline-flex items-center text-[#4977ec] hover:brightness-75 font-medium"
                        >
                            Browse FAQs
                            <span className="ml-1">→</span>
                        </Link>
                    </div>

                    {/* Contact Info Card */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="text-xl">📞</div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Direct Contact
                            </h2>
                        </div>
                        <section className="mt-4 flex flex-col gap-4 items-start justify-start bg-[#fdfdfd] drop-shadow-sm rounded-md p-4">
                            <div className="flex items-center justify-start gap-3">
                                <div className="size-4 cursor-pointer hover:fill-[#4977ec] fill-[#202020]">
                                    {icons.email}
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <div className="cursor-pointer hover:text-[#2e5cd3] text-[15px]">
                                        {CONTACTS.email}
                                    </div>

                                    <div
                                        className="size-4 hover:fill-[#2e5cd3] cursor-pointer fill-[#4977ec]"
                                        onClick={copyEmail}
                                    >
                                        {icons.clipboard}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-start gap-3">
                                <div className="size-4 cursor-pointer hover:fill-[#4977ec] fill-[#202020]">
                                    {icons.contact}
                                </div>

                                <div
                                    className="cursor-pointer hover:text-[#2e5cd3] text-[15px]"
                                    onClick={callNumber}
                                >
                                    {CONTACTS.phone}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Right Column - Feedback Form */}
                <div className="flex-1">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="text-xl">🌟</div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Feedback & Suggestions
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-4 text-[15px]">
                            Have ideas on how we can improve? We'd love to hear
                            from you! Your feedback helps us make{' '}
                            <span className="font-medium">Peer Connect</span>{' '}
                            better for everyone.
                        </p>

                        <form onSubmit={submitFeedback} className="space-y-4">
                            <div className="space-y-1">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={inputs.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full px-4 text-[15px] py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    We'll only use this email to respond to your
                                    feedback
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label
                                    htmlFor="feedback"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Feedback / Suggestion{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="feedback"
                                    name="feedback"
                                    value={inputs.feedback}
                                    onChange={handleChange}
                                    placeholder="Let us know how we're doing!"
                                    className="w-full px-4 py-2 text-[15px] min-h-30 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                btnText="Submit Feedback"
                                onClick={submitFeedback}
                                defaultStyles={true}
                                className="w-full py-2 text-white"
                            >
                                Submit Feedback
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
