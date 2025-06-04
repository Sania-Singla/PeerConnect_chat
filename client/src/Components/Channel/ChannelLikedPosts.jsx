import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LikedPostView } from '@/Components';
import { likeService } from '@/Services';
import { paginate } from '@/Utils';
import { icons } from '@/Assets/icons';
import { LIMIT } from '@/Constants/constants';
import { useChannelContext, useUserContext } from '@/Context';

export default function LikedPostsPage() {
    const [posts, setPosts] = useState([]);
    const { channel } = useChannelContext();
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { user } = useUserContext();
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(postsInfo?.hasNextPage, loading, setPage);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getPosts() {
            try {
                setLoading(true);
                const res = await likeService.getLikedPosts(
                    signal,
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

        return () => controller.abort();
    }, [page, user]);

    const postElements = posts?.map((post, index) => (
        <LikedPostView
            key={post.post_id}
            likedPost={post}
            reference={
                index + 1 === posts.length && postsInfo?.hasNextPage
                    ? paginateRef
                    : null
            }
        />
    ));

    return user?.user_id !== channel.user_id ? (
        <div>You are not authorised to see these posts</div>
    ) : (
        <div>
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
                        No liked posts !!
                    </div>
                )
            )}
        </div>
    );
}
