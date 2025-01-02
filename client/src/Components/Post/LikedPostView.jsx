import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { likeService } from '../../Services';
import { Button, PostListView } from '..';
import { icons } from '../../Assets/icons';

export default function LikedPostView({ post, reference }) {
    const { post_id } = post;
    const [isLiked, setIsLiked] = useState(true);
    const navigate = useNavigate();

    async function toggleLike() {
        try {
            const res = await likeService.togglePostLike(post_id, true);
            if (res && res.message === 'post like toggled successfully') {
                setIsLiked((prev) => !prev);
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    return (
        <PostListView post={post} reference={reference}>
            {/* children */}
            <div
                className="absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    btnText={
                        isLiked ? (
                            <div className="size-[20px] group-hover:fill-red-700">
                                {icons.delete}
                            </div>
                        ) : (
                            <div className="size-[20px] group-hover:fill-[#4977ec]">
                                {icons.undo}
                            </div>
                        )
                    }
                    className="bg-[#f0efef] p-3 group rounded-full drop-shadow-lg hover:bg-[#ebeaea]"
                    onClick={toggleLike}
                />
            </div>
        </PostListView>
    );
}
