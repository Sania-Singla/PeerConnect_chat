import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    requestService,
    followerService,
    likeService,
    postService,
} from '@/Services';
import { Button, Comments, Recemendations } from '@/Components';
import { formatDateRelative, formatCount } from '@/Utils';
import { useUserContext, usePopupContext, useSocketContext } from '@/Context';
import { icons } from '@/Assets/icons';
import parse from 'html-react-parser';
import toast from 'react-hot-toast';

export default function PostPage() {
    const { postId } = useParams();
    const [loading, setLoading] = useState(true);
    const { setPopupInfo, setShowPopup } = usePopupContext();
    const [post, setPost] = useState(null);
    const [request, setRequest] = useState(null);
    const [chat, setChat] = useState(null);
    const { user } = useUserContext();
    const navigate = useNavigate();
    const { socket } = useSocketContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getPost() {
            try {
                setLoading(true);
                const res = await postService.getPost(signal, postId);
                if (res && !res.message) {
                    setPost(res);
                    if (user) {
                        const request = await requestService.getRequest(
                            res.post_ownerId,
                            signal
                        );
                        if (request && !request.message) {
                            if (request.isRequest) setRequest(request);
                            else setChat(request);
                        }
                    }
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [postId, user]);

    async function toggleLike() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Like' });
                return;
            }
            setPost((prev) => {
                if (prev.isLiked) {
                    return {
                        ...prev,
                        totalLikes: prev.totalLikes - 1,
                        isLiked: false,
                    };
                } else {
                    return {
                        ...prev,
                        totalLikes: prev.totalLikes + 1,
                        totalDislikes: prev.isDisliked
                            ? prev.totalDislikes - 1
                            : prev.totalDislikes,
                        isLiked: true,
                        isDisliked: false,
                    };
                }
            });

            const res = await likeService.togglePostLike(postId, true);
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function toggleDislike() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Dislike' });
                return;
            }
            setPost((prev) => {
                if (prev.isDisliked) {
                    return {
                        ...prev,
                        totalDislikes: prev.totalDislikes - 1,
                        isDisliked: false,
                    };
                } else {
                    return {
                        ...prev,
                        totalDislikes: prev.totalDislikes + 1,
                        totalLikes: prev.isLiked
                            ? prev.totalLikes - 1
                            : prev.totalLikes,
                        isDisliked: true,
                        isLiked: false,
                    };
                }
            });

            const res = await likeService.togglePostLike(postId, false);
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function toggleFollow() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Follow' });
                return;
            }
            setPost((prev) => ({
                ...prev,
                isFollowed: !prev.isFollowed,
            }));

            const res = await followerService.toggleFollow(post.owner.user_id);
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function toggleSave() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Save' });
                return;
            }

            setPost((prev) => ({ ...prev, isSaved: !prev.isSaved }));

            toast.success(
                `${
                    post.isSaved
                        ? 'Post Unsaved Successfully 🙂'
                        : 'Post Saved Successfully 🤗'
                }`
            );

            const res = await postService.toggleSavePost(postId);
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function handleCollab() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Collab' });
                return;
            }
            if (request) {
                if (request.sender_id === user.user_id) {
                    toast.error('Collab Request Already Sent');
                    return;
                } else {
                    const res = await requestService.acceptRequest(
                        request.request_id
                    );
                    if (res && !res.message) {
                        toast.success(
                            'Collab Request Accepted Successfully 🤝'
                        );
                        socket.emit('requestAccepted', res);
                        setChat(res);
                        setRequest(null);
                    }
                }
            } else if (chat) {
                navigate(`/chat/${chat.chat_id}`);
            } else {
                const res = await requestService.sendRequest(post.post_ownerId);
                if (res && !res.message) {
                    socket.emit('newRequest', res);
                    setRequest(res);
                    toast.success('Request Sent Successfully 🤝');
                }
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    return loading ? (
        <div>loading...</div>
    ) : !post ? (
        <div>Post Not Found !!</div>
    ) : (
        <div className="relative w-full h-full flex flex-col items-start justify-start gap-y-6 overflow-y-scroll">
            <div className="w-full px-2">
                <div className="w-full flex items-start justify-start flex-col xl:flex-row gap-6">
                    {/* post */}
                    <div className="w-full xl:w-[75%] h-full">
                        {/* post image */}
                        <div className="relative h-[250px] md:h-[300px] rounded-xl overflow-hidden shadow-sm">
                            <img
                                src={post.post_image}
                                alt="post image"
                                className="object-cover w-full h-full"
                            />

                            {/* SMALL SCREEN */}
                            {/* post category */}
                            <div className="xl:hidden absolute top-2 left-2 hover:cursor-text flex items-center justify-center gap-2 bg-[#ffffff] shadow-sm rounded-full w-fit px-3 py-1">
                                <div className="size-[10px] fill-[#2556d1]">
                                    {icons.dot}
                                </div>
                                <span className="text-[#2556d1]">
                                    {post.category.category_name.toUpperCase()}
                                </span>
                            </div>

                            {/* saved btn */}
                            <div className="xl:hidden absolute top-2 right-2 flex items-center justify-center">
                                <Button
                                    btnText={
                                        <div
                                            className={`${
                                                post.isSaved
                                                    ? 'fill-[#4977ec] '
                                                    : 'fill-white'
                                            } size-[20px] stroke-[#4977ec] group-hover:stroke-[#2a4b9f]`}
                                        >
                                            {icons.save}
                                        </div>
                                    }
                                    onClick={toggleSave}
                                    className="bg-[#f6f6f6] p-3 group rounded-full drop-shadow-md hover:bg-[#ebeaea]"
                                />
                            </div>
                        </div>

                        {/* post title */}
                        <div className="hover:cursor-text text-2xl font-semibold text-black mt-4">
                            {post.post_title}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                            {/* statistics */}
                            <div className="hover:cursor-text text-[15px] text-gray-500 italic text-sm">
                                {formatCount(post.totalViews)} views &bull;
                                posted
                                {' ' + formatDateRelative(post.post_createdAt)}
                            </div>

                            {/* like/dislike btn */}
                            <div className="bg-[#f0efef] rounded-full flex overflow-hidden shadow-sm hover:bg-[#ebeaea]">
                                <Button
                                    btnText={
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className={`${
                                                    post.isLiked
                                                        ? 'fill-[#4977ec] stroke-[#4977ec]'
                                                        : 'fill-none stroke-black'
                                                } size-[18px]`}
                                            >
                                                {icons.like}
                                            </div>
                                            <div className="text-black">
                                                {formatCount(post.totalLikes)}
                                            </div>
                                        </div>
                                    }
                                    onClick={toggleLike}
                                    className="bg-[#f0efef] py-[7px] px-3 hover:bg-[#ebeaea] border-r-[0.1rem] border-[#e6e6e6]"
                                />
                                <Button
                                    btnText={
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className={`${
                                                    post.isDisliked
                                                        ? 'fill-[#4977ec] stroke-[#4977ec]'
                                                        : 'fill-none stroke-black'
                                                } size-[18px]`}
                                            >
                                                {icons.dislike}
                                            </div>
                                            <div className="text-black">
                                                {formatCount(
                                                    post.totalDislikes
                                                )}
                                            </div>
                                        </div>
                                    }
                                    onClick={toggleDislike}
                                    className="bg-[#f0efef] py-[7px] px-3 hover:bg-[#ebeaea]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="shadow-sm bg-[#f9f9f9] pt-3 p-4 rounded-xl w-full xl:w-[25%] flex flex-col">
                        {/* BIGGER SCREEN */}
                        <div className="hidden xl:flex items-center justify-between w-full">
                            {/* post category */}
                            <div className="hover:cursor-text flex items-center justify-center gap-2 bg-[#ffffff] shadow-sm rounded-full w-fit px-3 py-1">
                                <div className="size-[10px] fill-[#2556d1]">
                                    {icons.dot}
                                </div>
                                <span className="text-[#2556d1]">
                                    {post.category.category_name}
                                </span>
                            </div>

                            {/* saved btn */}
                            <div className="flex items-center justify-center">
                                <Button
                                    btnText={
                                        <div
                                            className={`${
                                                post.isSaved
                                                    ? 'fill-[#4977ec] '
                                                    : 'fill-white'
                                            } size-[20px] stroke-[#4977ec] group-hover:stroke-[#2a4b9f]`}
                                        >
                                            {icons.save}
                                        </div>
                                    }
                                    onClick={toggleSave}
                                    className="bg-[#f6f6f6] p-3 group rounded-full shadow-sm hover:bg-[#ebeaea]"
                                />
                            </div>
                        </div>

                        {/* owner info: FOR BOTH SMALLER & BIGGER SCREENS */}
                        <div className="w-full flex xl:flex-col items-center justify-between gap-2 xl:mt-4">
                            <div className="flex gap-4 xl:flex-col items-center justify-start w-full">
                                {/* avatar */}
                                <div
                                    onClick={(e) => {
                                        navigate(
                                            `/channel/${post.owner.user_id}`
                                        );
                                    }}
                                    className="w-fit cursor-pointer"
                                >
                                    <div className="size-[60px] xl:size-[100px] shadow-sm rounded-full overflow-hidden">
                                        <img
                                            alt="post owner avatar"
                                            src={post.owner.user_avatar}
                                            className="size-full object-cover rounded-full hover:brightness-90"
                                        />
                                    </div>
                                </div>

                                <div className="w-full flex flex-col items-start xl:items-center justify-start">
                                    <div
                                        onClick={(e) => {
                                            navigate(
                                                `/channel/${post.owner.user_id}`
                                            );
                                        }}
                                        className="w-fit cursor-pointer text-ellipsis line-clamp-1 text-lg xl:text-[20px] hover:text-[#5c5c5c] font-medium text-black"
                                    >
                                        {post.owner.user_fullName}
                                    </div>

                                    <div
                                        onClick={(e) => {
                                            navigate(
                                                `/channel/${post.owner.user_id}`
                                            );
                                        }}
                                        className="w-fit text-[16px] cursor-pointer text-gray-900 hover:text-gray-700"
                                    >
                                        @{post.owner.user_name}
                                    </div>
                                </div>
                            </div>

                            <div className="text-black text-lg mt-[2px]">
                                {user?.user_name === post.owner.user_name ? (
                                    <Button
                                        btnText="Edit"
                                        title="Edit Post"
                                        onClick={() =>
                                            navigate(`/update/${post.post_id}`)
                                        }
                                        className="rounded-md text-white py-[4px] px-3 bg-[#4977ec] hover:bg-[#3b62c2]"
                                    />
                                ) : (
                                    <div className="flex gap-2 sm:gap-4">
                                        <Button
                                            btnText={
                                                post.isFollowed
                                                    ? 'Unfollow'
                                                    : 'Follow'
                                            }
                                            onClick={toggleFollow}
                                            className="rounded-md py-[5px] px-3 sm:px-6 text-white bg-[#4977ec] hover:bg-[#3b62c2]"
                                        />
                                        <Button
                                            btnText={
                                                user
                                                    ? chat
                                                        ? 'Chat'
                                                        : request?.sender_id ===
                                                            user.user_id
                                                          ? 'Request Sent'
                                                          : request?.receiver_id ===
                                                              user.user_id
                                                            ? 'Accept'
                                                            : 'Connect'
                                                    : 'Connect'
                                            }
                                            onClick={handleCollab}
                                            className="rounded-md py-[5px] px-3 sm:px-6 text-white bg-[#4977ec] hover:bg-[#3b62c2]"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="mt-6" />

                {/* content */}
                <div className="rich-text text-black w-full text-md mt-6 bg-[#f9f9f9] shadow-md shadow-gray-300 rounded-xl overflow-hidden p-8">
                    {parse(post.post_content)}
                </div>
            </div>

            {/* recemendations */}
            <div className="w-full">
                <hr className="mt-0 mb-6 w-full" />
                <h2 className="mb-6 font-semibold text-xl">
                    Recommended Similar Posts
                </h2>
                <div className="w-full">
                    <Recemendations category={post.category.category_name} />
                </div>
            </div>

            {/* comments */}
            <div className="w-full">
                <hr className="mt-2 mb-6 w-full" />
                <h2 className="mb-6 font-semibold text-xl">
                    Comments & Reviews
                </h2>
                <div className="w-full">
                    <Comments />
                </div>
            </div>
        </div>
    );
}
