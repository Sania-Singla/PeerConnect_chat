import { CONTRIBUTORS } from '@/Constants/constants';
import { Link } from 'react-router-dom';

function FeatureCard({ title, description }) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-700 mt-2">{description}</p>
        </div>
    );
}

function PrivacyCard({ title, description }) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-700 mt-2">{description}</p>
        </div>
    );
}

export default function AboutUsPage() {
    return (
        <div className="w-full min-h-screen sm:p-4">
            {/* Hero Section */}
            <section className="w-full bg-[#fbfbfb] shadow-md rounded-xl p-8 md:px-10">
                <h1 className="text-[35px] font-bold text-gray-900">
                    About Peer Connect
                </h1>
                <p className="mt-4 text-gray-700">
                    Welcome to <strong>Peer Connect</strong>, a platform created
                    by students for students. We aim to provide a space where
                    peers can share their thoughts, experiences, and ideas while
                    building connections within the college community.
                </p>
            </section>

            {/* Content Section with Grid Layout */}
            <div className="w-full px-8 md:px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Mission */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Our Mission
                    </h2>
                    <p className="text-gray-700 mt-3">
                        Our mission is to create a digital space that encourages
                        collaboration, learning, and fun through writing.
                        Whether it's about the latest campus event, personal
                        experiences, or simply sharing knowledge, Peer Connect
                        serves as the go-to place for students to express
                        themselves and connect with like-minded individuals.
                    </p>
                </div>

                {/* Why We Started */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Why We Started
                    </h2>
                    <p className="text-gray-700 mt-3">
                        As college students, we wanted a place where we could
                        freely share our ideas and engage with others. We
                        realized that many students have great stories to tell,
                        but sometimes there isn't a dedicated space to share
                        them. So, we decided to build Peer Connect as a way to
                        bridge that gap.
                    </p>
                </div>
            </div>

            {/* Features Section */}
            <section className="w-full px-8 md:px-10 py-10 bg-gray-100 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                    What We Offer
                </h2>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="✍️ Blog Posts"
                        description="Articles written by students, for students, covering a wide range of topics from personal experiences to helpful tips."
                    />
                    <FeatureCard
                        title="🤝 Collaboration"
                        description="A place where students can work together on projects, share ideas, and make new connections."
                    />
                    <FeatureCard
                        title="🌱 Community Building"
                        description="We foster a positive, open environment where everyone can contribute and grow together."
                    />
                    <FeatureCard
                        title="🔒 Privacy Focused"
                        description="We take your privacy seriously with secure authentication and data protection."
                    />
                    <FeatureCard
                        title="💡 Knowledge Sharing"
                        description="A platform to exchange academic insights, study tips, and campus resources."
                    />
                    <FeatureCard
                        title="🎉 Campus Engagement"
                        description="Stay updated on events, activities, and opportunities within your college community."
                    />
                </div>
            </section>

            {/* Meet the Team */}
            <section className="w-full px-8 md:px-10 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Meet the Team
                </h2>
                <p className="text-gray-700 mt-3">
                    Our team consists of passionate students who are eager to
                    make a difference in the college community. We come from
                    different backgrounds, but we share a common goal: to build
                    a space for students to connect, collaborate, and grow.
                </p>
                <div className="flex w-full justify-center">
                    <div className="mt-8 flex flex-wrap justify-evenly gap-x-4 gap-y-8 w-full">
                        {CONTRIBUTORS.map((contributor) => (
                            <div
                                key={contributor.name}
                                className="flex flex-col items-center"
                            >
                                <div className="size-24 rounded-full overflow-hidden shadow-sm hover:brightness-90 transition duration-300">
                                    <img
                                        src={contributor.image}
                                        alt={contributor.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="mt-2 font-semibold text-gray-800">
                                    {contributor.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy & Security */}
            <section className="w-full px-8 md:px-10 py-12 bg-gray-100 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                    Privacy Policy
                </h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PrivacyCard
                        title="🔹 Data Collection"
                        description="We collect personal information like your name and email when you register or interact with the platform."
                    />
                    <PrivacyCard
                        title="🔹 Data Use"
                        description="Your data is used solely to enable platform features and improve your experience."
                    />
                    <PrivacyCard
                        title="🔹 Third-Party Services"
                        description="We may use analytics services to understand user interactions, which may collect anonymized data."
                    />
                    <PrivacyCard
                        title="🔹 Cookies"
                        description="Our website uses cookies to enhance functionality. You can manage cookie preferences in your browser."
                    />
                    <PrivacyCard
                        title="🔹 Security Measures"
                        description="We implement industry-standard security practices to protect your personal information."
                    />
                    <PrivacyCard
                        title="🔹 User Control"
                        description="You can update or delete your account information at any time through your profile settings."
                    />
                </div>
            </section>

            {/* Contact Section */}
            <section className="w-full px-8 md:px-10 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Get In Touch
                </h2>
                <p className="text-md text-gray-700 mt-3">
                    Have questions or want to collaborate? Connect with us on{' '}
                    <Link
                        to="https://discord.com/channels/@sania_singla"
                        target="_blank"
                        className="text-blue-500 font-medium hover:underline"
                    >
                        Discord
                    </Link>{' '}
                    or drop us an email. We'd love to hear from you!
                </p>
            </section>
        </div>
    );
}
