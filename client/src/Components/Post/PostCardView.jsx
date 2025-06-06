import { Link, useNavigate } from 'react-router-dom';
import { formatCount, formatDateRelative } from '@/Utils';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import parse from 'html-react-parser';

export default function PostCardView({
    post,
    reference,
    showOwnerInfo = false,
    children,
}) {
    const {
        post_id,
        post_image,
        post_content,
        post_title,
        post_createdAt,
        owner,
        totalViews,
    } = post;
    const navigate = useNavigate();

    return (
        <div
            ref={reference}
            onClick={() => navigate(`/post/${post_id}`)}
            className="min-w-[300px] flex flex-col items-start justify-center gap-6 relative cursor-pointer w-full p-4 bg-white drop-shadow-md rounded-2xl overflow-hidden"
        >
            {/* post image */}
            <div className="h-[200px] drop-shadow-md w-full rounded-xl overflow-hidden">
                <img
                    alt="post image"
                    src={post_image}
                    className="h-full object-cover w-full"
                />
            </div>

            <div className="w-full">
                <div className="hover:cursor-text text-wrap text-sm text-[#5a5a5a] text-end">
                    {formatCount(totalViews)} views &bull;
                    {' ' + formatDateRelative(post_createdAt)}
                </div>

                <div className="hover:cursor-text text-xl font-medium text-black text-ellipsis line-clamp-1 mt-3">
                    {post_title}
                </div>

                <div className="hover:cursor-text text-sm text-gray-500 text-ellipsis line-clamp-2 mt-4">
                    {parse(post_content)}
                </div>

                {/* show owner info if home page */}
                {showOwnerInfo && owner && (
                    <Link
                        to={`/channel/${owner.user_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-start justify-start gap-3 mt-5"
                    >
                        {/* avatar */}
                        <div className="drop-shadow-md">
                            <div className="size-[50px]">
                                <img
                                    alt="post owner avatar"
                                    src={owner.user_avatar}
                                    loading="lazy"
                                    className="size-full object-cover rounded-full hover:brightness-90"
                                />
                            </div>
                        </div>

                        {/* channel info */}
                        <div className="">
                            <div className="text-ellipsis line-clamp-1 text-[18px] hover:text-[#5c5c5c] font-medium text-black w-fit">
                                {owner.user_fullName}
                            </div>

                            <div className="text-black hover:text-[#5c5c5c] text-[16px] w-fit">
                                @{owner.user_name}
                            </div>
                        </div>
                    </Link>
                )}

                <div className="w-full flex items-center justify-end text-white mt-3">
                    <Button
                        btnText={
                            <div className="flex items-center justify-center gap-3">
                                <span>Read more</span>
                                <div className="size-[16px] fill-white">
                                    {icons.rightArrow}
                                </div>
                            </div>
                        }
                        defaultStyles={true}
                        onClick={() => navigate(`/post/${post_id}`)}
                        className="py-[5px] px-3 text-white"
                    />
                </div>
            </div>

            {children}
        </div>
    );
}
