import { useNavigate } from 'react-router-dom';
import { icons } from '@/Assets/icons';
import { formatDateExact, formatCount } from '@/Utils';
import { postService } from '@/Services';
import { Button } from '@/Components';
import toast from 'react-hot-toast';

export default function AdminPostRow({ post, reference, setPosts }) {
    const {
        post_id,
        post_title,
        post_image,
        post_visibility,
        post_createdAt,
        totalLikes,
        totalDislikes,
        category_name,
        totalViews,
        totalComments,
    } = post;

    const navigate = useNavigate();

    async function togglePostVisibility() {
        try {
            const res = await postService.togglePostVisibility(post_id);
            if (res && res.message === 'post visibility toggled successfully') {
                setPosts((prev) =>
                    prev.map((post) => {
                        if (post.post_id === post_id) {
                            return {
                                ...post,
                                post_visibility: !post.post_visibility,
                            };
                        } else return post;
                    })
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function deletePost() {
        try {
            const res = await postService.deletePost(post_id);
            if (res && res.message === 'post deleted successfully') {
                toast.success('Post deleted successfully');
                setPosts((prev) =>
                    prev.filter((post) => post.post_id !== post_id)
                );
            }
            ``;
        } catch (err) {
            navigate('/server-error');
        }
    }

    return (
        <tr
            ref={reference}
            className="bg-[#f9f9f9] border-b-[0.01rem] border-b-[#c1c1c1]"
        >
            <td className="">
                <div className="flex items-center justify-center">
                    <label
                        htmlFor={post_id}
                        className="relative inline-block w-12 cursor-pointer overflow-hidden"
                    >
                        <input
                            type="checkbox"
                            id={post_id}
                            className="peer sr-only"
                            checked={post_visibility}
                            onChange={togglePostVisibility}
                        />

                        {icons.toggle}
                    </label>
                </div>
            </td>

            <td className="text-center px-8">
                <div className="w-[130px] flex items-center justify-center">
                    {post_visibility ? (
                        <div className="border-[0.1rem] border-[#008300] text-lg rounded-full px-3 text-[#008300]">
                            Published
                        </div>
                    ) : (
                        <div className="border-[0.1rem] border-[#ba0000] text-lg rounded-full px-3 text-[#ba0000]">
                            Unpublished
                        </div>
                    )}
                </div>
            </td>

            <td className="py-[13px]">
                <div
                    onClick={() => navigate(`/post/${post_id}`)}
                    className="flex items-center justify-start w-full cursor-pointer"
                >
                    <div className="size-[45px] rounded-full overflow-hidden">
                        <img
                            src={post_image}
                            alt={post_title}
                            className="size-full object-cover"
                        />
                    </div>
                    <div className="text-[1.1rem] font-medium ml-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[250px]">
                        {post_title}
                    </div>
                </div>
            </td>

            <td className=" text-center text-[1.1rem]">{category_name}</td>
            <td className=" text-center text-[1.1rem]">
                {formatDateExact(post_createdAt)}
            </td>
            <td className=" text-center text-[1.1rem] ">
                {formatCount(totalViews)}
            </td>
            <td className=" text-center text-[1.1rem]">
                {formatCount(totalComments)}
            </td>

            <td className="">
                <div className="flex items-center justify-center">
                    <div className="drop-shadow-md rounded-md bg-[#d9fed9] px-2 py-[2px] text-[#196619] text-[1.1rem]">
                        {formatCount(totalLikes)} likes
                    </div>
                    <div className="drop-shadow-md rounded-md bg-[#ffd8d8] px-2 py-[2px] ml-4 text-[#ba2828] text-[1.1rem]">
                        {formatCount(totalDislikes)} dislikes
                    </div>
                </div>
            </td>

            <td className="">
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={deletePost}
                        title="Delete"
                        className="bg-[#ffffff] group p-2 rounded-full drop-shadow-md w-fit"
                        btnText={
                            <div className="size-[20px] fill-black group-hover:fill-[#d42828]">
                                {icons.delete}
                            </div>
                        }
                    />
                    <Button
                        title="Edit"
                        onClick={() => navigate(`/update/${post_id}`)}
                        className="bg-[#ffffff] p-2 group rounded-full drop-shadow-md w-fit"
                        btnText={
                            <div className="size-[20px] fill-black group-hover:fill-[#2256db]">
                                {icons.edit}
                            </div>
                        }
                    />
                </div>
            </td>
        </tr>
    );
}
