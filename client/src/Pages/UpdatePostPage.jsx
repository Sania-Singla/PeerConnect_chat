import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, RTE } from '@/Components';
import { verifyExpression, fileRestrictions } from '@/Utils';
import { postService } from '@/Services';
import { useUserContext } from '@/Context';
import { MAX_FILE_SIZE } from '@/Constants/constants';
import toast from 'react-hot-toast';

export default function UpdatePostPage() {
    const [inputs, setInputs] = useState({
        title: '',
        postImage: null,
        content: '',
        categoryId: '',
    });
    const [error, setError] = useState({});
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [defaultRTEValue, setDefaultRTEValue] = useState('');
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        (async function getPost() {
            try {
                setLoading(true);
                const res = await postService.getPost(signal, postId);
                if (res && !res.message) {
                    setPost(res);
                    setInputs({
                        title: res.post_title,
                        postImage: null,
                        content: res.post_content,
                        category: res.category_name,
                    });
                    setDefaultRTEValue(res.post_content);
                    setThumbnailPreview(res.post_image);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e) {
        const { files, name } = e.target;
        if (files && files[0]) {
            const file = files[0];

            if (!fileRestrictions(file)) {
                return toast.error(
                    `only png, jpg/jpeg files are allowed and File size should not exceed ${MAX_FILE_SIZE} MB.`
                );
            }

            setInputs((prev) => ({ ...prev, [name]: file }));
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            setError((prevError) => ({
                ...prevError,
                postImage: 'thumbnail is required.',
            }));
        }
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        if (value) {
            verifyExpression(name, value, setError);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setUploading(true);
            setDisabled(true);
            const res = await postService.updatePostDetails(
                {
                    title: inputs.title,
                    categoryId: inputs.categoryId,
                    content: inputs.content,
                },
                postId
            );
            const res1 = await postService.updatePostImage(
                inputs.postImage,
                postId
            );
            if (res && res1 && !res.message && !res1.message) {
                toast.success('Post Updated Successfully 🤗');
                navigate(`/post/${postId}`);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setUploading(false);
            setDisabled(false);
        }
    }

    function onMouseOver() {
        if (
            Object.values(inputs).some((value) => !value) ||
            Object.values(error).some((error) => error)
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    useEffect(() => {
        (async function getCategories() {
            const res = await fetch('/api/categories/', {
                method: 'GET',
            });

            const data = await res.json();
            console.log(data);
            setCategories(data);
        })();
    }, []);

    const categoryElements = !categories.length
        ? []
        : categories.map((category) => (
              <label
                  htmlFor={category.category_name}
                  key={category.category_name}
                  className="hover:bg-[#ebebeb] hover:text-black text-[#2556d1] text-[18px] hover:cursor-pointer flex items-center justify-start gap-3 bg-[#ffffff] rounded-full w-fit px-4 py-[4px]"
              >
                  <input
                      type="radio"
                      name="categoryId"
                      id={category.category_name}
                      value={category.category_id}
                      checked={inputs.categoryId === category.category_id} // just good for verification
                      onChange={handleChange}
                  />
                  {category.category_name}
              </label>
          ));

    return loading ? (
        <div>loading...</div>
    ) : user.user_name === post.owner.user_name ? (
        <div className="w-full h-full overflow-scroll">
            <h2 className="text-[#252525] w-full text-center mb-8 underline underline-offset-2">
                Update a Post
            </h2>
            <form
                onSubmit={handleSubmit}
                className="w-full h-full flex flex-col md:flex-row items-start justify-start gap-10"
            >
                <div className="w-full md:w-[70%] h-full">
                    <div className="w-full flex items-center justify-between gap-10">
                        <div className="w-full">
                            <div className="flex items-center justify-start gap-2">
                                <div className="bg-white z-[1] ml-3 px-2 w-fit text-[1.1rem] relative top-3 font-medium">
                                    <label htmlFor="title">
                                        <span className="text-red-500">* </span>
                                        Title :
                                    </label>
                                </div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter Post Title"
                                    name="title"
                                    id="title"
                                    onChange={handleChange}
                                    value={inputs.title}
                                    onBlur={handleBlur}
                                    className="shadow-md shadow-[#f7f7f7] py-[18px] rounded-[5px] pl-[10px] w-full border-[0.01rem] border-gray-500 bg-transparent"
                                />
                            </div>
                            {error.title && (
                                <div className="pt-[0.09rem] text-red-500 text-sm">
                                    {error.title}
                                </div>
                            )}
                        </div>

                        <div className="w-full">
                            <div className="flex items-center justify-start gap-2">
                                <div className="bg-white z-[1] ml-3 px-2 w-fit text-[1.1rem] relative top-3 font-medium">
                                    <label htmlFor="postImage">
                                        <span className="text-red-500">* </span>
                                        Thumbnail :
                                    </label>
                                </div>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    name="postImage"
                                    id="postImage"
                                    className="shadow-md shadow-[#f7f7f7] py-[15px] rounded-[5px] pl-[10px] border border-gray-500 w-full"
                                />
                            </div>
                            {error.postImage && (
                                <div className="pt-[0.09rem] text-red-500 text-sm">
                                    {error.postImage}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full mt-10">
                        <div className="text-lg font-medium">
                            <span className="text-red-500">* </span>Content :
                        </div>
                        <RTE
                            defaultValue={defaultRTEValue}
                            onChange={() =>
                                setInputs((prev) => ({
                                    ...prev,
                                    content: tinymce.activeEditor.getContent(),
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="h-full w-full md:w-[30%] flex flex-col items-center">
                    <div className="drop-shadow-md w-full flex items-center justify-center">
                        <div className="max-w-[400px] h-[220px] md:max-w-[300px] w-full md:h-[180px] rounded-lg overflow-hidden">
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="thumbnail preview"
                                    className="object-cover h-full w-full border-[0.01rem] border-[#838383] rounded-lg"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 h-full w-full border-[0.01rem] border-[#838383] rounded-xl">
                                    <div
                                        className="bg-[#f9f9f9] p-2
                                    rounded-full drop-shadow-md w-fit"
                                    >
                                        <div className="size-[20px]">
                                            {icons.image}
                                        </div>
                                    </div>
                                    <div className="text-lg">
                                        Thumbnail Preview
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="drop-shadow-md bg-[#f9f9f9] p-6 max-w-[300px] md:max-w-[280px] w-full gap-6 mt-8 flex flex-col items-center">
                        <div className="text-xl font-medium">
                            <span className="text-red-500">* </span>Select a
                            Category :
                        </div>
                        <div className="flex flex-col items-center justify-start gap-3">
                            {categoryElements}
                        </div>
                    </div>

                    <div className="w-full text-center mt-10">
                        <Button
                            btnText={uploading ? 'Updating...' : 'Update'}
                            type="submit"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            className="text-white rounded-md py-2 text-lg w-full max-w-[300px] md:max-w-[280px] bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                </div>
            </form>
        </div>
    ) : (
        <div>You're not authorized for this operation.</div>
    );
}
