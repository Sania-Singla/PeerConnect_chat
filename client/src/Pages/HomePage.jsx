import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostListView } from '../Components';
import { postService } from '../Services';
import { paginate } from '../Utils';
import { icons } from '../Assets/icons';
import { LIMIT } from '../Constants/constants';
import { useSearchContext } from '../Context';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [page, setPage] = useState(1);
    const { search } = useSearchContext();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // pagination
    const paginateRef = paginate(postsInfo.hasNextPage, loading, setPage);

    useEffect(() => {
        (async function getPosts() {
            try {
                setLoading(true);
                const res = await postService.getRandomPosts(page, LIMIT);
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
    }, [page]);

    const postElements = posts
        ?.filter((post) => {
            const title = post.post_title.toLowerCase();
            if (search && title.includes(search.toLowerCase())) return post;
            if (!search) return post;
        })
        .map((post, index) => (
            <PostListView
                key={post.post_id}
                post={post}
                reference={index + 1 === posts.length ? paginateRef : null}
            />
        ));

    return (
        <div>
            {loading ? (
                page === 1 ? (
                    <div className="w-full text-center">
                        loading first batch...
                    </div>
                ) : (
                    <div className="flex items-center justify-center my-2 w-full">
                        <div className="size-7 fill-[#4977ec]">
                            {icons.loading}
                        </div>
                        <span className="text-xl ml-3">Please wait . . .</span>
                    </div>
                )
            ) : postElements.length > 0 ? (
                <div>{postElements}</div>
            ) : (
                <div>No posts found !!</div>
            )}
        </div>
    );
}
