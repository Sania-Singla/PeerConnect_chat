import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '@/Services';
import { Button, PostListView } from '@/Components';
import { icons } from '@/Assets/icons';

export default function SavedPostView({ savedPost, reference }) {
    const { post_id } = savedPost;
    const [isSaved, setIsSaved] = useState(true);
    const navigate = useNavigate();

    async function toggleSave() {
        try {
            const res = await postService.toggleSavePost(post_id);
            if (res && res.message === 'post save toggled successfully') {
                setIsSaved((prev) => !prev);
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    const { post, ...rest } = savedPost;
    const modifiedPost = { ...rest, ...post };

    return (
        <PostListView post={modifiedPost} reference={reference}>
            {/* children */}
            <div
                className="absolute top-2 right-2"
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    btnText={
                        isSaved ? (
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
                    onClick={toggleSave}
                />
            </div>
        </PostListView>
    );
}
