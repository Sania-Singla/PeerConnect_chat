import { Link } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import { useState } from 'react';
import { CONTRIBUTORS, LOGO } from '@/Constants/constants';
import toast from 'react-hot-toast';

export default function Footer() {
    const [feedback, setFeedback] = useState('');

    const socialElements = Object.entries(CONTRIBUTORS[0].socials).map(
        ([platform, url]) => (
            <Link
                key={platform}
                to={url}
                target="_blank"
                className="size-[15px] hover:fill-[#4977ec]"
            >
                {icons[platform]}
            </Link>
        )
    );

    const links = [
        { path: '/', name: 'Home' },
        { path: '/support', name: 'Support' },
        { path: '/about-us', name: 'About Us' },
        { path: '/add', name: 'Add Blog' },
    ];

    const linkElements = links.map((link) => (
        <p className="text-center" key={link.name}>
            <Link
                to={link.path}
                className="hover:text-[#4977ec] text-[15px] hover:underline"
            >
                {link.name}
            </Link>
        </p>
    ));

    function submitFeedback(e) {
        e.preventDefault();
        setFeedback('');
        toast.success('Feedback Submitted Successfully 🤗');
    }

    return (
        <footer className="px-6 pt-6 pb-4 bg-[#f6f6f6]">
            <div className="flex flex-wrap justify-between gap-4 border-b-[0.09rem] border-[#e0e0e0]">
                <div className="">
                    <p className="text-black font-medium">
                        Stay Social, Stay Organized.
                    </p>

                    <Link
                        to={'/'}
                        className="flex items-center mt-4 justify-start gap-2"
                    >
                        <div>
                            <div className="size-[40px] rounded-full overflow-hidden drop-shadow-md">
                                <img
                                    src={LOGO}
                                    alt="peer connect logo"
                                    className="object-cover size-full"
                                />
                            </div>
                        </div>
                        <div className="text-black font-medium">
                            Peer Connect
                        </div>
                    </Link>
                </div>

                <div className="text-black">
                    <p className="text-center underline font-medium underline-offset-2 text-black">
                        Quick Links
                    </p>
                    <div>{linkElements}</div>
                </div>

                <form
                    onSubmit={submitFeedback}
                    className="w-full flex flex-col items-center justify-center gap-2 max-w-[350px]"
                >
                    <p className="text-black font-medium underline underline-offset-2">
                        Provide a Feedback
                    </p>
                    <div className="flex items-center justify-center gap-4 h-[32px] w-full">
                        <input
                            type="text"
                            placeholder="Provide a Feedback !!"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="bg-transparent border-gray-500 border-[0.01rem] w-full indent-2 rounded-md px-[5px] h-full text-black placeholder:text-[15px] focus:border-[#4977ec] outline-none placeholder:text-[#505050]"
                        />
                        <Button
                            btnText={'Submit'}
                            type="submit"
                            className="text-white rounded-md px-3 h-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                </form>
            </div>

            <div className="flex flex-col xs:flex-row gap-2 transition-all ease-in-out items-center justify-between w-full">
                <p className="text-black text-xs sm:text-sm text-center">
                    &copy; 2024 Peer Connect. All rights reserved.
                </p>
                <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                    {socialElements}
                </div>
            </div>
        </footer>
    );
}
