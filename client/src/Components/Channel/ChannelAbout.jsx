import { NavLink } from 'react-router-dom';
import { useChannelContext } from '@/Context';
import { formatDateExact } from '@/Utils';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';

export default function ChannelAbout() {
    const { channel } = useChannelContext();
    const {
        user_id,
        user_name,
        user_fullName,
        user_bio,
        user_createdAt,
        user_email,
        totalViews,
        totalFollowers,
        totalPosts,
    } = channel;

    function copyEmail() {
        window.navigator.clipboard.writeText(user_email);
        toast.success('Email copied to clipboard');
    }

    const stats = [
        {
            icon: icons.people,
            label: 'Followers',
            value: totalFollowers.toLocaleString(),
        },
        {
            icon: icons.posts,
            label: 'Posts',
            value: totalPosts.toLocaleString(),
        },
        { icon: icons.eye, label: 'Views', value: totalViews.toLocaleString() },
    ];

    const infoCards = [
        {
            icon: icons.email,
            title: 'Email',
            content: (
                <div className="flex items-center group">
                    <span className="text-[#4977ec] hover:text-[#3a5fbc] transition-colors truncate">
                        {user_email}
                    </span>
                    <button
                        onClick={copyEmail}
                        className="ml-2 text-gray-400 hover:text-[#4977ec] transition-colors"
                        aria-label="Copy email"
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            {icons.clipboard}
                        </svg>
                    </button>
                </div>
            ),
        },
        {
            icon: icons.globe,
            title: 'Channel URL',
            content: (
                <NavLink
                    to={`/channel/${user_id}`}
                    className="text-[#4977ec] hover:text-[#3a5fbc] hover:underline transition-colors break-all"
                >
                    note-manager/channel/{user_name}
                </NavLink>
            ),
        },
        {
            icon: icons.date,
            title: 'Joined',
            content: formatDateExact(user_createdAt),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Profile Header Card */}
            <div className="bg-[#f6f6f6] rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#4977ec16] p-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {user_fullName}
                    </h1>
                    <p className="text-gray-600 mt-1">@{user_name}</p>
                </div>

                {user_bio && (
                    <div className="p-6 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                            {user_bio}
                        </p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-[#f6f6f6] rounded-xl shadow-sm border border-gray-200 p-5"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-[#e6e9f6] rounded-lg mr-3">
                                <svg
                                    className="w-5 h-5 text-[#4977ec]"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    {stat.icon}
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {stat.label}
                                </p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {infoCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-[#f6f6f6] rounded-xl shadow-sm border border-gray-200 p-5"
                    >
                        <div className="flex items-start">
                            <div className="p-2 bg-[#e6e9f6] rounded-lg mr-3">
                                <svg
                                    className="w-5 h-5 text-[#4977ec]"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    {card.icon}
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>
                                <div className="mt-1 text-gray-800">
                                    {card.content}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
