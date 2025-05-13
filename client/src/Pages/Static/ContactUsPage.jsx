import { Link } from 'react-router-dom';
import { Button } from '@/Components';
import { useState } from 'react';
import { icons } from '@/Assets/icons';
import { EMAIL, CONTACTNUMBER } from '@/Constants/constants';
import toast from 'react-hot-toast';

export default function ContactUsPage() {
    const [inputs, setInputs] = useState({ email: '', feedback: '' });

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function submitFeedback(e) {
        e.preventDefault();
        setInputs({ feedback: '', email: '' });
        toast.success('Feedback Submitted Successfully 🤗');
    }

    function copyEmail() {
        window.navigator.clipboard.writeText(EMAIL);
        toast.success('Email Copied to Clipboard 🤗');
    }

    return (
        <div className="w-full h-full flex items-start justify-center">
            <div className="w-[90%] h-full flex flex-col items-start justify-start gap-4">
                <section className="w-full">
                    <h1 className="w-full font-semibold text-center mb-6">
                        Contact Us
                    </h1>
                    <p className="text-justify">
                        We're here to help! you make the most of your
                        experience! Whether you have feedback, need support, or
                        looking for guidance, feel free to reach out to us. Our
                        team is ready to assist you on every step on the way!
                    </p>
                </section>

                <hr className="w-full" />

                <div className="flex flex-col lg:flex-row items-start justify-between lg:gap-24 gap-14 w-full h-full">
                    <div className="flex flex-col w-full items-start justify-start gap-4">
                        <section className=" w-full">
                            <h2 className="mb-4 text-md">
                                👥 Technical Support
                            </h2>
                            <p className="text-justify">
                                Need help navigating{' '}
                                <Link
                                    to={'/'}
                                    className="font-semibold text-[#4977ec] hover:underline"
                                >
                                    Peer Connect
                                </Link>{' '}
                                or having technical issues? Visit our{' '}
                                <Link
                                    to={'/support'}
                                    className="text-nowrap font-semibold text-[#4977ec] hover:underline"
                                >
                                    Support Page
                                </Link>{' '}
                                for assistance, troubleshooting tips, and to
                                connect directly with team members if you need
                                further help.
                            </p>
                        </section>

                        <hr className="w-full" />

                        <section>
                            <h2 className="mb-4 text-md">
                                📚 Frequently Asked Questions (FAQs)
                            </h2>
                            <p className="text-justify">
                                For common questions and guidance, check out our{' '}
                                <Link
                                    to={'/faqs'}
                                    className="font-semibold text-[#4977ec]  hover:underline"
                                >
                                    FAQ page
                                </Link>
                                . You might find the answer you're looking for
                                right there!
                            </p>
                        </section>

                        {/* <hr className="w-full" /> */}

                        <section className="mt-4 flex flex-col gap-4 items-start justify-start bg-[#fdfdfd] drop-shadow-md rounded-md p-4">
                            <div className="flex items-center justify-start gap-3">
                                <div className="flex items-center justify-center">
                                    <div className="bg-[#f3f3f3] p-2 rounded-full w-fit drop-shadow-xl hover:brightness-95">
                                        <div className="size-[16px]">
                                            {icons.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <div className="cursor-text">{EMAIL}</div>

                                    <div
                                        className="size-[15px] hover:fill-[#2e5cd3] cursor-pointer fill-[#4977ec]"
                                        onClick={copyEmail}
                                    >
                                        {icons.clipboard}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-start gap-3">
                                <div className="flex items-center justify-center">
                                    <div className="bg-[#f3f3f3] p-2 rounded-full w-fit drop-shadow-xl hover:brightness-95">
                                        <div className="size-[16px]">
                                            {icons.contact}
                                        </div>
                                    </div>
                                </div>

                                <div className="cursor-text">
                                    {CONTACTNUMBER}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* <div className="border-[0.01rem] border-[red] h-[calc(100%-60px)]" /> */}

                    <div className="w-full">
                        <section className="w-full">
                            <h2 className="mb-4">🌟 Feedback & Suggestions</h2>
                            <p className="text-justify">
                                Have ideas on how we can improve? We'd love to
                                hear from you! Please share your thoughts using
                                our Feedback Form, our team will review them to
                                make{' '}
                                <Link
                                    to={'/'}
                                    className="font-semibold text-[#4977ec] hover:underline"
                                >
                                    Peer Connect
                                </Link>{' '}
                                better for everyone.
                            </p>
                        </section>

                        <form
                            onSubmit={submitFeedback}
                            className="mt-2 w-full flex flex-col items-start justify-center gap-3"
                        >
                            <div className="w-full">
                                <div className="bg-white z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                                    <label htmlFor="email">
                                        Email
                                        <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input
                                        type="email"
                                        name="email"
                                        value={inputs.email}
                                        onChange={handleChange}
                                        placeholder="Enter your Email"
                                        className="shadow-md shadow-[#efefef] px-2 py-4 rounded-md indent-2 w-full border-[0.01rem] border-[#aeaeae] bg-transparent placeholder:text-[#a0a0a0]"
                                    />
                                </div>
                                <p className="text-sm">
                                    this email will be sent along with the
                                    feedback
                                </p>
                            </div>

                            <div className="w-full">
                                <div className="bg-white z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                                    <label htmlFor="feedback">
                                        Feedback / Suggestion
                                        <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <div className="w-full">
                                    <textarea
                                        placeholder="Let us know how are we doing !!"
                                        value={inputs.feedback}
                                        onChange={handleChange}
                                        name="feedback"
                                        className="shadow-md shadow-[#efefef] bg-transparent border border-black w-full indent-2 rounded-md p-2 pt-4 text-black placeholder:text-[15px] placeholder:text-[#a0a0a0] resize-y"
                                        rows="4"
                                        cols="50"
                                        style={{ minHeight: '100px' }}
                                    />
                                </div>
                            </div>

                            <Button
                                btnText={'Submit'}
                                type="submit"
                                className="text-white mt-4 rounded-md w-full py-2 px-3 bg-[#4977ec] hover:bg-[#3b62c2]"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
