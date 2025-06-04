import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChannelContext, useUserContext } from '@/Context';
import { postService } from '@/Services';
import { icons } from '@/Assets/icons';
import { PostCardView, Button } from '..';
import { paginate } from '@/Utils';
import { LIMIT } from '@/Constants/constants';

export default function ChannelPosts() {
    const { channel } = useChannelContext();
    const { user } = useUserContext();
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // fetching posts
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getChannelPosts() {
            try {
                setLoading(true);
                const res = await postService.getPosts(
                    signal,
                    channel.user_id,
                    LIMIT,
                    page
                );
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostsInfo(res.postsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [channel.user_id, page]);

    // pagination
    const paginateRef = paginate(postsInfo?.hasNextPage, loading, setPage);

    // displaying posts
    const postElements = posts?.map((post, index) => (
        <PostCardView
            key={post.post_id}
            post={post}
            reference={
                index + 1 === posts.length && postsInfo?.hasNextPage
                    ? paginateRef
                    : null
            }
        />
    ));

    return (
        <div className="w-full">
            <div className="w-full">
                {user?.user_name === channel.user_name && (
                    <div className="w-full flex items-center justify-center my-8">
                        <Button
                            btnText={
                                <div className="flex items-center justify-center gap-2">
                                    <div className="size-[20px] fill-white">
                                        {icons.plus}
                                    </div>
                                    <div>New Post</div>
                                </div>
                            }
                            onClick={() => navigate('/add')}
                            className="rounded-md text-white py-2 text-lg px-4 bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                )}
            </div>

            {postElements.length > 0 && (
                <div
                    className={
                        postElements.length > 1
                            ? 'grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-x-6'
                            : 'w-[450px]'
                    }
                >
                    {postElements}
                </div>
            )}

            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">
                        loading first batch...
                    </div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#4977ec] dark:text-[#f7f7f7]">
                            {icons.loading}
                        </div>
                    </div>
                )
            ) : (
                postElements.length === 0 && (
                    <div className="text-sm italic text-gray-500">
                        No posts found !!
                    </div>
                )
            )}
        </div>
    );
}
