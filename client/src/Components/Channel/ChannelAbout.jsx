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
        user_firstName,
        user_lastName,
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

    return (
        <div className="pl-2">
            <div className="mb-6">
                <div className="text-4xl font-medium">
                    {user_firstName} {user_lastName}
                </div>
                <div className="text-[1.4rem] text-[#333333]">@{user_name}</div>
                <div className="mt-2 text-[#3f3f3f]">{user_bio}</div>
            </div>

            <div className="text-3xl mb-4 font-medium">Channel details</div>

            <div className="flex flex-col gap-2 items-start justify-start mt-2 text-lg">
                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[black] hover:fill-[#4977ec]">
                        {icons.email}
                    </div>

                    <div className="flex  items-center justify-center gap-1">
                        <div className="cursor-pointer text-blue-600 hover:text-blue-700 ">
                            {user_email}
                        </div>

                        <div
                            className="size-[15px] cursor-pointer fill-[black] hover:fill-[#4977ec]"
                            onClick={copyEmail}
                        >
                            {icons.clipboard}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[23px] fill-[black] hover:fill-[#4977ec]">
                        {icons.globe}
                    </div>
                    <NavLink
                        to={`/channel/${user_id}`}
                        className="text-blue-600 hover:text-blue-700 pb-1"
                    >
                        https://note-manager/channel/{user_name}
                    </NavLink>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[black] hover:fill-[#4977ec]">
                        {icons.people}
                    </div>
                    <div>{totalFollowers} followers</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[black] hover:fill-[#4977ec]">
                        {icons.posts}
                    </div>
                    <div>{totalPosts} posts</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[black] hover:fill-[#4977ec]">
                        {icons.eye}
                    </div>
                    <div>{totalViews} views</div>
                </div>

                <div className="flex items-center justify-start gap-3">
                    <div className="size-[20px] fill-[black] hover:fill-[#4977ec]">
                        {icons.date}
                    </div>
                    <div>Joined on {formatDateExact(user_createdAt)}</div>
                </div>
            </div>
        </div>
    );
}
