import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { commentService } from '@/Services';
import { formatCount } from '@/Utils';
import { Comment, Button } from '@/Components';
import { usePopupContext, useUserContext } from '@/Context';
import toast from 'react-hot-toast';

export default function Comments() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingComment, setAddingComment] = useState(false);
    const [input, setInput] = useState('');
    const { setPopupInfo, setShowPopup } = usePopupContext();
    const { user } = useUserContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getComments() {
            try {
                setLoading(true);
                const res = await commentService.getComments(signal, postId);
                if (res) {
                    setComments(res.message === 'no comments found' ? [] : res);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [postId, user]);

    async function addComment(e) {
        e.preventDefault();
        try {
            if (!user) {
                setShowPopup(true);
                setPopupInfo({ type: 'login', content: 'Comment' });
                return;
            }
            if (!input) return;
            setAddingComment(true);
            const res = await commentService.addComment(postId, input);
            if (res && !res.message) {
                setComments((prev) => [res, ...prev]);
                toast.success('Comment Added Successfully 🤗');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setAddingComment(false);
            setInput('');
        }
    }

    const commentElements = comments?.map((comment) => (
        <Comment
            key={comment.comment_id}
            comment={comment}
            setComments={setComments}
        />
    ));

    return loading ? (
        <div>loading...</div>
    ) : (
        <div>
            <form
                onSubmit={addComment}
                className="w-full flex items-center justify-between gap-4 mt-2"
            >
                <input
                    type="text"
                    placeholder="Add a new Comment"
                    name="comment"
                    id="comment"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="placeholder-black w-full bg-transparent border-black border-[0.01rem] shadow-md shadow-gray-200 rounded-lg p-[5px] indent-2 text-black"
                />
                <div className="flex items-center gap-x-3">
                    <Button
                        type="reset"
                        btnText="Cancel"
                        onClick={(e) => setInput('')}
                        className="text-white bg-[#4977ec] hover:bg-[#3b62c2] px-4 py-1 group rounded-full drop-shadow-md"
                    />
                    <Button
                        type="submit"
                        btnText={addingComment ? 'adding...' : 'Comment'}
                        disabled={addingComment}
                        className="text-white bg-[#4977ec] hover:bg-[#3b62c2] px-3 py-1 group rounded-full drop-shadow-md"
                    />
                </div>
            </form>

            {/* // TODO: pagination */}
            {comments.length > 0 ? (
                <div className="">
                    <div className="mt-4 text-black">
                        {formatCount(comments.length)} Comments
                    </div>
                    <div className="mt-4">{commentElements}</div>
                </div>
            ) : (
                <div className="text-gray-500 italic text-sm mt-4">
                    No Comments Found !!
                </div>
            )}
        </div>
    );
}
