import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCardView } from '@/Components';
import { postService } from '@/Services';
import { paginate } from '@/Utils';
import { icons } from '@/Assets/icons';
import { LIMIT } from '@/Constants/constants';
import { useSearchContext } from '@/Context';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const { search } = useSearchContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(postsInfo?.hasNextPage, loading, setPage);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getPosts() {
            try {
                setLoading(true);
                const res = await postService.getRandomPosts(
                    signal,
                    page,
                    LIMIT
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
    }, [page]);

    const postElements = posts
        ?.filter((post) => {
            const title = post.post_title.toLowerCase();
            if (search && title.includes(search.toLowerCase())) return post;
            if (!search) return post;
        })
        .map((post, index) => (
            <PostCardView
                key={post.post_id}
                post={post}
                showOwnerInfo={true}
                reference={
                    index + 1 === posts.length && postsInfo?.hasNextPage
                        ? paginateRef
                        : null
                }
            />
        ));

    return (
        <div className="p-4">
            {postElements.length > 0 && (
                <div className="grid grid-flow-dense gap-x-4 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(300px,max-content))] justify-center">
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
                postElements.length === 0 && <div>No posts found !!</div>
            )}
        </div>
    );
}
