import { Link } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { motion } from 'framer-motion';

export default function ContributorCard({ contributor }) {
    const { name, role, bio, image, socials } = contributor;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -8,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
            }}
            className="relative bg-[#f9f9f9] w-full max-w-[320px] rounded-xl overflow-hidden drop-shadow-sm transition-all"
        >
            {/* Background accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#4977ec]" />

            {/* Content */}
            <div className="flex flex-col items-center p-6">
                {/* Avatar with subtle glow */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative mb-4 size-24 rounded-full border-2 border-white shadow-lg"
                >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60" />
                    <img
                        loading="lazy"
                        src={image}
                        alt={`${name}'s profile`}
                        className="relative z-10 size-full object-cover rounded-full"
                    />
                </motion.div>

                {/* Text content */}
                <div className="text-center space-y-1 w-full">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        {name}
                    </h3>
                    <p className="text-[#4977ec] font-medium text-sm">{role}</p>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mt-3">
                        {bio}
                    </p>
                </div>

                {/* Social links with hover effects */}
                <div className="mt-5 flex space-x-4">
                    {Object.entries(socials).map(
                        ([platform, url]) =>
                            url && (
                                <motion.div key={platform}>
                                    <Link
                                        to={url}
                                        target="_blank"
                                        aria-label={`${name}'s ${platform}`}
                                    >
                                        <div className="size-5 fill-gray-800 hover:fill-[#4977ec] transition-colors">
                                            {icons[platform]}
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                    )}
                </div>
            </div>
        </motion.div>
    );
}
