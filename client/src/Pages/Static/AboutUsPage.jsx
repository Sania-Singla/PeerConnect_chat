import { CONTRIBUTORS } from '@/Constants/constants';
import { Link } from 'react-router-dom';

export default function AboutUsPage() {
    const members = CONTRIBUTORS.map((contributor) => (
        <div
            key={contributor.name}
            className="flex flex-col gap-3 items-center justify-center"
        >
            <div className="drop-shadow-xl hover:brightness-90">
                <div className="size-[100px] rounded-full overflow-hidden">
                    <img
                        src={contributor.image}
                        alt="contributor profile image"
                        className="size-full object-cover"
                    />
                </div>
            </div>
            <div className="w-full text-center font-semibold text-xl">
                {contributor.name}
            </div>
        </div>
    ));

    return (
        <div className="w-full flex items-start justify-center">
            <div className="w-[90%]">
                <h1 className="w-full font-semibold text-center mb-6">
                    About Us
                </h1>
                <p className="text-md">
                    Welcome to <strong>Peer Connect</strong>, a platform created
                    by students for students. We aim to provide a space where
                    peers can share their thoughts, experiences, and ideas while
                    building connections within the college community.
                </p>
                <hr className="my-6" />
                <h2 className="w-full text-center my-6">Our Mission</h2>
                <p className="text-md">
                    Our mission is to create a digital space that encourages
                    collaboration, learning, and fun through writing. Whether
                    it's about the latest campus event, personal experiences, or
                    simply sharing knowledge, College Connect Blog serves as the
                    go-to place for students to express themselves and connect
                    with like-minded individuals.
                </p>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Why We Started?</h2>
                <p className="text-md">
                    As college students, we wanted a place where we could freely
                    share our ideas and engage with others. We realized that
                    many students have great stories to tell, but sometimes
                    there isn't a dedicated space to share them. So, we decided
                    to build College Connect Blog as a way to bridge that gap
                    and provide a platform for communication and connection.
                </p>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">What We Do</h2>
                <ul>
                    <li>
                        <strong>Blog Posts:</strong> Articles written by
                        students, for students, covering a wide range of topics
                        from personal experiences to helpful tips and advice.
                    </li>
                    <li>
                        <strong>Collaboration:</strong> A place where students
                        can collaborate on projects, share ideas, and make new
                        connections.
                    </li>
                    <li>
                        <strong>Community Building:</strong> We believe in the
                        power of community. Through College Connect, we aim to
                        foster a positive, open environment where everyone can
                        contribute.
                    </li>
                </ul>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Meet the Team</h2>
                <p className="text-md">
                    Our team consists of passionate students who are eager to
                    make a difference in the college community. We come from
                    different zones, but we share a common goal: to build a
                    space for students to connect, collaborate, and grow.
                </p>
                <div className="mt-10 flex flex-wrap justify-evenly gap-4 w-full">
                    {members}
                </div>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Privacy Policy</h2>
                <p className="text-md">
                    Your privacy is important to us. Below is our Privacy Policy
                    outlining how we handle your data:
                </p>
                <ul>
                    <li>
                        <strong>Data Collection:</strong> We collect personal
                        information like your name, email address, and any other
                        details you provide when registering or commenting on
                        the blog.
                    </li>
                    <li>
                        <strong>Data Use:</strong> Your personal data is used
                        solely for the purpose of enabling you to interact with
                        the blog (e.g., posting comments, subscribing to
                        updates).
                    </li>
                    <li>
                        <strong>Third-Party Services:</strong> We may use
                        third-party services like Google Analytics to help us
                        understand how users interact with our website. These
                        services may collect data such as IP addresses and
                        device information.
                    </li>
                    <li>
                        <strong>Cookies:</strong> Our website uses cookies to
                        enhance your experience. By using the site, you agree to
                        our use of cookies.
                    </li>
                    <li>
                        <strong>Security:</strong> We take the security of your
                        personal information seriously. We use standard industry
                        practices to protect your data.
                    </li>
                    <li>
                        <strong>Opt-Out:</strong> If you no longer wish to
                        receive communications from us, you can opt out at any
                        time by clicking the "Unsubscribe" link in our emails.
                    </li>
                </ul>
                <hr className="m-8" />
                <h2 className="w-full text-center my-6">Contact Us</h2>
                <p className="text-md">
                    If you have any questions or would like to collaborate, feel
                    free to connect with us on{' '}
                    <Link
                        className="text-[#3547ec] font-medium hover:underline"
                        target="_blank"
                        to={'https://discord.com/channels/@sania_singla'}
                    >
                        Discord
                    </Link>
                    . We would love to hear from you!!
                </p>
            </div>
        </div>
    );
}
