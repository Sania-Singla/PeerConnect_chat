import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileRestrictions, verifyExpression } from '@/Utils';
import { Button, RTE } from '@/Components';
import { postService } from '@/Services';
import { icons } from '@/Assets/icons';
import { BASE_BACKEND_URL, MAX_FILE_SIZE } from '@/Constants/constants';
import toast from 'react-hot-toast';

export default function AddPostPage() {
    const [inputs, setInputs] = useState({
        title: '',
        postImage: null,
        content: '',
        categoryId: '',
    });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState({});

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e) {
        const { files } = e.target;
        if (files?.[0]) {
            const file = files[0];

            if (!fileRestrictions(file)) {
                return toast.error(
                    `only png, jpg/jpeg files are allowed and File size should not exceed ${MAX_FILE_SIZE} MB.`
                );
            }

            setInputs((prev) => ({ ...prev, postImage: file }));
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
            setLoading(true);
            const res = await postService.addPost(inputs);
            if (res && !res.message) {
                toast.success('Post Created Successfully 🤗');
                navigate(`/post/${res.post_id}`);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
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
            const res = await fetch(`${BASE_BACKEND_URL}/categories/`, {
                method: 'GET',
            });

            const data = await res.json();
            setCategories(data);
        })();
    }, []);

    const categoryElements = !categories.length
        ? []
        : categories?.map((category) => (
              <label
                  htmlFor={category.category_name}
                  key={category.category_name}
                  className="hover:bg-[#ebebeb] hover:text-black text-[#2556d1] hover:cursor-pointer flex items-center justify-start gap-2 bg-[#ffffff] shadow-sm rounded-full w-fit px-3 py-[3px]"
              >
                  <input
                      type="radio"
                      name="categoryId"
                      id={category.category_name}
                      value={category.category_id}
                      checked={inputs.categoryId === category.category_id} // just good for verification
                      onChange={handleChange}
                      className="size-[10px]"
                  />
                  {category.category_name}
              </label>
          ));

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
                Add a New Post
            </h2>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col lg:flex-row gap-10 w-full"
            >
                {/* Left: Content Section */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-md space-y-8">
                    {/* Title Field */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block font-medium text-gray-700 mb-1"
                        >
                            <span className="text-red-500">*</span> Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={inputs.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Enter a descriptive title"
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {error.title}
                            </p>
                        )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div>
                        <label
                            htmlFor="postImage"
                            className="block font-medium text-gray-700 mb-1"
                        >
                            <span className="text-red-500">*</span> Thumbnail
                        </label>
                        <input
                            type="file"
                            name="postImage"
                            id="postImage"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-md p-3"
                        />
                        {error.postImage && (
                            <p className="text-red-500 text-sm mt-1">
                                {error.postImage}
                            </p>
                        )}
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">
                            <span className="text-red-500">*</span> Content
                        </label>
                        <RTE
                            onChange={() =>
                                setInputs((prev) => ({
                                    ...prev,
                                    content: tinymce.activeEditor.getContent(),
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="lg:w-[30%] w-full space-y-8">
                    {/* Thumbnail Preview */}
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="text-center font-medium text-gray-800 mb-2">
                            Thumbnail Preview
                        </div>
                        <div className="w-full aspect-video border rounded-md overflow-hidden bg-gray-100">
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail Preview"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full">
                                    <div className="flex items-center justify-center size-10 text-gray-400">
                                        {icons.image}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-lg font-medium mb-4 text-center text-gray-800">
                            <span className="text-red-500">*</span> Select a
                            Category
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {categoryElements}
                        </div>
                    </div>

                    <div className="w-full text-center">
                        <Button
                            btnText={
                                loading ? (
                                    <div className="w-full flex items-center justify-center">
                                        <div className="size-5 fill-white dark:text-[#c5d5ff]">
                                            {icons.loading}
                                        </div>
                                    </div>
                                ) : (
                                    'Upload'
                                )
                            }
                            type="submit"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            className="text-white rounded-md py-3 text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
