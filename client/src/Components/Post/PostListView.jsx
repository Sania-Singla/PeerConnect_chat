import { Link, useNavigate } from 'react-router-dom';
import { formatCount, formatDateRelative } from '@/Utils';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import parse from 'html-react-parser';
import { memo } from 'react';

const PostListView = memo(({ post, reference, children }) => {
    const {
        post_id,
        post_content,
        post_image,
        totalViews,
        post_title,
        post_createdAt,
        owner,
    } = post;
    const { user_id, user_name, user_avatar, user_fullName } = owner;

    const navigate = useNavigate();

    return (
        <div
            ref={reference}
            onClick={() => navigate(`/post/${post_id}`)} // items-start justify-start
            className="hidden relative cursor-pointer gap-x-4"
        >
            <div className="w-full relative">
                {/* post image */}
                <div className="h-[200px] drop-shadow-sm w-full rounded- overflow-hidden">
                    <img
                        alt="post image"
                        src={post_image}
                        className="h-full object-cover w-full"
                    />
                </div>

                <div className="absolute top-2 right-2 hover:cursor-text text-xs bg-white rounded-full px-3 py-1 drop-shadow-sm text-[#4977ec] font-medium">
                    {formatCount(totalViews)} views &bull;
                    {' ' + formatDateRelative(post_createdAt)}
                </div>
            </div>

            <div className="w-full">
                <div className="hover:cursor-text text-xl font-medium text-black text-ellipsis line-clamp-2 mt-[5px]">
                    {post_title}
                </div>

                <div className="hover:cursor-text text-sm text-gray-500 text-ellipsis leading-5 line-clamp-2 mt-1">
                    {parse(post_content)}
                </div>

                <div className="flex items-center justify-between mt-3">
                    <Link
                        to={`/channel/${user_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex gap-2"
                    >
                        {/* avatar */}
                        <div className="size-10">
                            <img
                                alt="post owner avatar"
                                src={user_avatar}
                                loading="lazy"
                                className="size-full object-cover rounded-full hover:brightness-90 drop-shadow-sm"
                            />
                        </div>

                        {/* channel info */}
                        <div className="relative -top-[2px]">
                            <div className="text-nowrap text-[15px] hover:text-[#5c5c5c] font-medium text-black w-fit">
                                {user_fullName}
                            </div>

                            <div className="text-black hover:text-[#5c5c5c] text-xs w-fit">
                                @{user_name}
                            </div>
                        </div>
                    </Link>

                    <div className="w-full flex items-center justify-end text-white">
                        <Button
                            btnText={
                                <div className="text-[#4977ec] flex items-center justify-center gap-[2px]">
                                    <span className="text-[14px] font-medium pb-[2px]">
                                        Read more
                                    </span>
                                    <div className="size-[13px] fill-[#4977ec]">
                                        {icons.chevronRight}
                                    </div>
                                </div>
                            }
                            onClick={() => navigate(`/post/${post_id}`)}
                            className="py-[5px] px-3 text-white"
                        />
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
});

export default PostListView;
