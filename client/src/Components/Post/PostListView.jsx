import { Link, useNavigate } from 'react-router-dom';
import { formatCount, formatDateRelative } from '../../Utils';
import { Button, PostCardView } from '..';
import { icons } from '../../Assets/icons';
import parse from 'html-react-parser';

export default function PostListView({ post, reference, children }) {
    const {
        post_id,
        category_name,
        post_content,
        post_image,
        totalViews,
        post_title,
        post_createdAt,
        firstName,
        lastName,
        userName,
        avatar,
        post_ownerId,
    } = post;

    const navigate = useNavigate();

    return (
        <div>
            {/* CARD VIEW */}
            <div className="sm:hidden">
                <PostCardView
                    post={post}
                    reference={reference}
                    showOwnerInfo={true}
                    children={children}
                />
            </div>

            {/* LIST VIEW */}
            <div
                ref={reference}
                onClick={() => navigate(`/post/${post_id}`)} // items-start justify-start
                className="mb-6 hidden relative cursor-pointer sm:flex flex-row w-full p-4 gap-x-6 bg-white drop-shadow-md rounded-2xl overflow-hidden"
            >
                {/* post image */}
                <div className="h-[300px] drop-shadow-md w-[45%] rounded-xl overflow-hidden">
                    <img
                        alt="post image"
                        src={post_image}
                        className="h-full object-cover w-full"
                    />
                </div>

                <div className="w-[55%] pt-4 realtive flex flex-col items-start justify-start">
                    <div className="flex items-start justify-between w-full">
                        {/* post category */}
                        <div className="hover:cursor-text flex items-center justify-center gap-2 bg-[#ffffff] drop-shadow-md rounded-full w-fit px-3 py-[2px]">
                            <div className="size-[9px] fill-[#2556d1]">
                                {icons.dot}
                            </div>
                            <span className="text-[#2556d1] text-[14px]">
                                {category_name.toUpperCase()}
                            </span>
                        </div>

                        {/* statistics */}
                        <div className="hover:cursor-text text-[15px] text-[#5a5a5a]">
                            {formatCount(totalViews)} views &bull; posted
                            {' ' + formatDateRelative(post_createdAt)}
                        </div>
                    </div>

                    {/* post title */}
                    <div className="hover:cursor-text text-2xl font-medium text-black text-ellipsis line-clamp-1 mt-5">
                        {post_title}
                    </div>

                    <div className="hover:cursor-text text-[17px] text-black text-ellipsis line-clamp-2 mt-4">
                        {parse(post_content)}
                    </div>

                    {/* user info */}
                    <Link
                        to={`/channel/${post_ownerId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-start justify-start gap-3 mt-6"
                    >
                        {/* avatar */}
                        <div className="drop-shadow-md">
                            <div className="size-[50px]">
                                <img
                                    alt="post owner avatar"
                                    src={avatar}
                                    className="size-full object-cover rounded-full hover:brightness-90"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="text-ellipsis line-clamp-1 text-[18px] hover:text-[#5c5c5c] font-medium text-black w-fit">
                                {firstName} {lastName}
                            </div>

                            <div className="text-black hover:text-[#5c5c5c] text-[16px] w-fit">
                                @{userName}
                            </div>
                        </div>
                    </Link>

                    <div className="absolute right-6 bottom-6 text-white">
                        <Button
                            btnText={
                                <div className="flex items-center justify-center gap-3">
                                    <span>Read more</span>
                                    <div className="size-[20px] fill-white">
                                        {icons.rightArrow}
                                    </div>
                                </div>
                            }
                            onClick={() => navigate(`/post/${post_id}`)}
                            className="rounded-md py-2 px-3 bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}
