import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '@/Services';
import { paginate } from '@/Utils';
import { icons } from '@/Assets/icons';
import { LIMIT } from '@/Constants/constants';
import { PostCardView } from '@/Components';

export default function Recemendations({ category }) {
    const { postId } = useParams();
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getPosts() {
            try {
                setLoading(true);
                const res = await postService.getRandomPosts(
                    signal,
                    page,
                    LIMIT,
                    category
                );
                if (res && !res.message) {
                    const recemendations = res.posts.filter(
                        (post) => post.post_id !== postId
                    );
                    setPosts((prev) => [...prev, ...recemendations]);
                    setPostsInfo(res.postsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [category, page]);

    // pagination
    const paginateRef = paginate(postsInfo?.hasNextPage, loading, setPage);

    const postElements = posts?.map((post, index) => (
        <PostCardView
            key={post.post_id}
            post={post}
            reference={
                index + 1 === posts.length && postsInfo?.hasNextPage
                    ? paginateRef
                    : null
            }
            showOwnerInfo={true}
        />
    ));

    return (
        <div className="w-full h-full">
            {postElements.length > 0 && (
                <div className="w-full overflow-x-auto grid grid-flow-col auto-cols-[minmax(350px,350px)] gap-6">
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
                    <div className="text-gray-500 italic text-sm mt-4">
                        No Similar Posts Found !!
                    </div>
                )
            )}
        </div>
    );
}
