import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { usePopupContext, useUserContext } from '@/Context';
import { commentService, likeService } from '@/Services';
import { formatDateRelative, formatCount } from '@/Utils';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import toast from 'react-hot-toast';

export default function Comment({ comment, setComments }) {
    const {
        comment_id,
        comment_content,
        comment_createdAt,
        isLiked,
        owner,
        likes,
        dislikes,
    } = comment;
    const { user_id, user_name, user_firstName, user_lastName, user_avatar } =
        owner;
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { setPopupInfo, setShowPopup } = usePopupContext();
    const [newContent, setNewContent] = useState(comment_content);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleLike() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Like' });
                return;
            }
            const res = await likeService.toggleCommentLike(comment_id, true);
            if (res && res.message === 'comment like toggled successfully') {
                setComments((prev) =>
                    prev.map((item) => {
                        if (item.comment_id === comment_id) {
                            if (item.isLiked === 1) {
                                return {
                                    ...item,
                                    isLiked: -1, // no interaction
                                    likes: item.likes - 1,
                                };
                            } else {
                                return {
                                    ...item,
                                    isLiked: 1,
                                    likes: item.likes + 1,
                                    dislikes:
                                        item.isLiked === 0
                                            ? item.dislikes - 1
                                            : item.dislikes, // -1 (no interaction hi rha hoga)
                                };
                            }
                        } else return item;
                    })
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function handleDislike() {
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Dislike' });
                return;
            }
            const res = await likeService.toggleCommentLike(comment_id, false);
            if (res && res.message === 'comment like toggled successfully') {
                setComments((prev) =>
                    prev.map((item) => {
                        if (item.comment_id === comment_id) {
                            if (item.isLiked === 0) {
                                return {
                                    ...item,
                                    isLiked: -1,
                                    dislikes: item.dislikes - 1,
                                };
                            } else {
                                return {
                                    ...item,
                                    isLiked: 0,
                                    dislikes: item.dislikes + 1,
                                    likes:
                                        item.isLiked === 1
                                            ? item.likes - 1
                                            : item.likes,
                                };
                            }
                        } else return item;
                    })
                );
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function editComment(e) {
        try {
            e.preventDefault();
            setIsUpdating(true);
            const res = await commentService.updateComment(
                comment_id,
                newContent
            );
            if (res && !res.message) {
                setComments((prev) =>
                    prev.map((item) => {
                        if (item.comment_id === comment_id) {
                            return {
                                ...item,
                                comment_content: newContent,
                            };
                        } else return item;
                    })
                );
                setIsEditing(false);
                toast.success('Comment Edited Successfully');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setIsUpdating(false);
        }
    }

    async function deleteComment() {
        try {
            const res = await commentService.deleteComment(comment_id);
            if (res && res.message === 'comment deleted successfully') {
                setComments((prev) =>
                    prev.filter((item) => item.comment_id !== comment_id)
                );
                toast.success('Comment Deleted Successfully');
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    return (
        <div className="w-full mb-6 bg-white drop-shadow-md relative flex items-start justify-start gap-x-4 rounded-xl p-4">
            <div>
                <NavLink to={`/channel/${user_id}`}>
                    <div className="rounded-full size-[50px] overflow-hidden">
                        <img
                            src={user_avatar}
                            alt="comment owner avatar"
                            className="size-full rounded-full hover:brightness-90"
                        />
                    </div>
                </NavLink>
            </div>

            <div className="w-full">
                <div>
                    <div className="flex items-center justify-start gap-2">
                        <div className="text-ellipsis line-clamp-1 text-[18px] hover:text-[#5c5c5c] font-medium text-black w-fit">
                            <NavLink to={`/channel/${user_id}`}>
                                {user_firstName} {user_lastName}
                            </NavLink>
                        </div>

                        <div className="hover:cursor-text text-[15px] text-[#5a5a5a]">
                            &bull; {' ' + formatDateRelative(comment_createdAt)}
                        </div>
                    </div>

                    <div className="text-black hover:text-[#5c5c5c] text-[16px] w-fit">
                        @{user_name}
                    </div>
                </div>

                {isEditing ? (
                    <form
                        onSubmit={editComment}
                        className="w-full flex items-center justify-between gap-4 mt-2"
                    >
                        <input
                            type="text"
                            placeholder="Add a comment"
                            name="comment"
                            value={newContent}
                            autoFocus
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full bg-transparent border-[0.01rem] rounded-lg p-[5px] indent-2 text-black"
                        />

                        <div className="flex items-center gap-x-3">
                            {/* reset btn */}
                            <Button
                                onClick={() => {
                                    setIsEditing(false);
                                    setNewContent(comment_content);
                                }}
                                btnText="Cancel"
                                className="text-black bg-[#f0efef] px-3 py-1 group rounded-full drop-shadow-md hover:bg-[#ebeaea]"
                            />

                            {/* submit btn */}
                            <Button
                                type="submit"
                                btnText={isUpdating ? 'Updating...' : 'Update'}
                                className="text-black bg-[#f0efef] px-3 py-1 group rounded-full drop-shadow-md hover:bg-[#ebeaea]"
                            />
                        </div>
                    </form>
                ) : (
                    <div className="hover:cursor-text text-[17px] text-black text-ellipsis line-clamp-2 mt-2">
                        {comment_content}
                    </div>
                )}

                <div className="bg-[#f0efef] rounded-full overflow-hidden mt-4 drop-shadow-md hover:bg-[#ebeaea] w-fit">
                    <Button
                        onClick={handleLike}
                        title="Like"
                        btnText={
                            <div className="flex items-center justify-center gap-2">
                                <div
                                    className={`${
                                        isLiked === 1
                                            ? 'fill-[#4977ec] stroke-[#4977ec]'
                                            : 'fill-none stroke-black'
                                    } size-[20px]`}
                                >
                                    {icons.like}
                                </div>
                                <div className="text-black">
                                    {formatCount(likes)}
                                </div>
                            </div>
                        }
                        className="bg-[#f0efef] py-[5px] px-2 hover:bg-[#ebeaea] border-r-[0.1rem] border-[#e6e6e6]"
                    />

                    <Button
                        onClick={handleDislike}
                        title="Dislike"
                        btnText={
                            <div className="flex items-center justify-center gap-2">
                                <div
                                    className={`${
                                        isLiked === 0
                                            ? 'fill-[#4977ec] stroke-[#4977ec]'
                                            : 'fill-none stroke-black'
                                    } size-[20px]`}
                                >
                                    {icons.dislike}
                                </div>
                                <div className="text-black">
                                    {formatCount(dislikes)}
                                </div>
                            </div>
                        }
                        className="bg-[#f0efef] py-[5px] px-2 hover:bg-[#ebeaea]"
                    />
                </div>
            </div>

            {user_name === user?.user_name && !isEditing && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 absolute top-2 right-2">
                    <Button
                        onClick={() => setIsEditing(true)}
                        btnText={
                            <div className="size-[20px] group-hover:fill-[#4977ec]">
                                {icons.edit}
                            </div>
                        }
                        title="Edit"
                        className="bg-[#f0efef] p-3 group rounded-full drop-shadow-md hover:bg-[#ebeaea]"
                    />

                    <Button
                        onClick={deleteComment}
                        btnText={
                            <div className="size-[20px] group-hover:fill-red-700">
                                {icons.delete}
                            </div>
                        }
                        title="Delete"
                        className="bg-[#f0efef] p-3 group rounded-full drop-shadow-md hover:bg-[#ebeaea]"
                    />
                </div>
            )}
        </div>
    );
}
