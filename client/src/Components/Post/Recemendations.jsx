import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '@/Services';
import { icons } from '@/Assets/icons';
import { PostCardView } from '@/Components';

export default function Recemendations() {
    const { postId } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getPosts() {
            try {
                setLoading(true);
                const res = await postService.getRandomPosts(signal);
                if (res && !res.message) {
                    const recemendations = res.posts.filter(
                        (post) => post.post_id !== postId
                    );
                    setPosts(recemendations);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    const postElements = posts?.map((post) => (
        <PostCardView key={post.post_id} post={post} showOwnerInfo={true} />
    ));

    return (
        <div className="w-full h-full">
            {postElements.length > 0 && (
                <div className="w-full overflow-x-auto grid grid-flow-col auto-cols-[minmax(350px,350px)] gap-6">
                    {postElements}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center my-2 w-full">
                    <div className="size-7 fill-[#4977ec] dark:text-[#f7f7f7]">
                        {icons.loading}
                    </div>
                </div>
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
