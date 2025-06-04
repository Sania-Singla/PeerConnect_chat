import { Link } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import { useState } from 'react';
import { CONTRIBUTORS, LOGO } from '@/Constants/constants';
import toast from 'react-hot-toast';

export default function Footer() {
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');

    const socialElements = Object.entries(CONTRIBUTORS[0].socials).map(
        ([platform, url]) => (
            <Link
                key={platform}
                to={url}
                target="_blank"
                className="size-6 hover:scale-110 transition-transform duration-200 hover:fill-[#4977ec] fill-[#282828]"
            >
                {icons[platform]}
            </Link>
        )
    );

    const linkCategories = [
        {
            title: 'Navigation',
            links: [
                { path: '/', name: 'Home' },
                { path: '/blogs', name: 'Blogs' },
                { path: '/resources', name: 'Resources' },
                { path: '/events', name: 'Events' },
            ],
        },
        {
            title: 'Support',
            links: [
                { path: '/support', name: 'Support' },
                { path: '/contact', name: 'Contact' },
                { path: '/faq', name: 'FAQs' },
            ],
        },
        {
            title: 'Company',
            links: [
                { path: '/about-us', name: 'About' },
                { path: '/team', name: 'Team' },
                { path: '/careers', name: 'Careers' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { path: '/privacy', name: 'Privacy' },
                { path: '/terms', name: 'Terms' },
                { path: '/cookies', name: 'Cookies' },
            ],
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedback.trim() || !email.trim()) {
            toast.error('Please fill all fields');
            return;
        }
        setFeedback('');
        setEmail('');
        toast.success('Thank you for your feedback! 🤗');
    };

    return (
        <footer className="px-6 py-6 bg-[#f6f6f6] border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content - Horizontal Layout */}
                <div className="flex flex-col lg:flex-row gap-8 pb-6">
                    {/* Brand and Social */}
                    <div className="lg:w-1/4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg overflow-hidden bg-white p-1 shadow-sm">
                                <img
                                    src={LOGO}
                                    alt="Peer Connect logo"
                                    className="object-contain size-full"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Peer Connect
                            </h3>
                        </div>
                        <p className="text-gray-600 text-xs">
                            Stay Social, Stay Organized. Connecting peers
                            through shared knowledge.
                        </p>
                        <div className="flex items-center gap-5 mt-8">
                            {socialElements}
                        </div>
                    </div>

                    {/* Compact Link Grid */}
                    <div className="lg:w-2/4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {linkCategories.map((category) => (
                                <div key={category.title} className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-800">
                                        {category.title}
                                    </h4>
                                    <ul className="space-y-1">
                                        {category.links.map((link) => (
                                            <li key={link.name}>
                                                <Link
                                                    to={link.path}
                                                    className="text-gray-600 hover:text-[#4977ec] text-xs hover:underline underline-offset-2"
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compact Feedback Form */}
                    <div className="lg:w-1/4 space-y-3 max-w-[300px]">
                        <h4 className="text-sm font-medium text-gray-800">
                            Stay Updated
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-gray-300 focus:border-[#4977ec] text-xs"
                                required
                            />
                            <textarea
                                placeholder="Quick feedback..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-gray-300 focus:border-[#4977ec] text-xs h-16"
                                rows="2"
                                required
                            />
                            <Button
                                btnText="Submit"
                                type="submit"
                                className="w-full bg-[#4977ec] hover:bg-[#3b62c2] text-white py-2 rounded text-xs font-medium"
                            />
                        </form>
                    </div>
                </div>

                {/* Copyright - Compact */}
                <div className="pt-4 border-t text-gray-500 text-xs border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>
                        &copy; {new Date().getFullYear()} Peer Connect. All
                        rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        <Link to="/privacy" className="hover:text-[#4977ec]">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:text-[#4977ec]">
                            Terms
                        </Link>
                        <Link
                            to="/accessibility"
                            className="hover:text-[#4977ec]"
                        >
                            Accessibility
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
