import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileRestrictions, verifyExpression } from '../Utils';
import { Button, RTE } from '../Components';
import { usePopupContext } from '../Context';
import { postService } from '../Services';
import { icons } from '../Assets/icons';

export default function AddPostPage() {
    const [inputs, setInputs] = useState({
        title: '',
        postImage: null,
        content: '',
        category: '',
    });
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const { setShowPopup, setPopupText } = usePopupContext();
    const [error, setError] = useState({
        title: '',
        postImage: '',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e) {
        const { files, name } = e.target;
        if (files && files[0]) {
            const file = files[0];

            setInputs((prev) => ({ ...prev, [name]: file }));
            fileRestrictions(file, name, setError);

            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
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
                setPopupText('Post Created Successfully 🤗');
                setShowPopup(true);
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

    const categories = [
        'Science',
        'Sci-Fi',
        'Technical',
        'Art',
        'Entertainment',
        'Others',
    ];

    const categoryElements = categories?.map((category) => (
        <label
            htmlFor={category}
            key={category}
            className="hover:bg-[#ebebeb] hover:text-black text-[#2556d1] text-[18px] hover:cursor-pointer flex items-center justify-start gap-3 bg-[#ffffff] rounded-full w-fit px-4 py-[4px]"
        >
            <input
                type="radio"
                name="category"
                id={category}
                value={category}
                checked={inputs.category === category} // just good for verification
                onChange={handleChange}
            />
            {category}
        </label>
    ));

    return (
        <div className="w-full h-full overflow-scroll">
            <h2 className="text-[#252525] w-full text-center mb-8 underline underline-offset-2">
                Add a New Post
            </h2>
            <form
                onSubmit={handleSubmit}
                className="w-full h-full flex flex-col lg:flex-row items-start justify-start gap-10"
            >
                <div className="w-full lg:w-[70%] h-full">
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-10">
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

                                {error.postImage && (
                                    <div className="pt-[0.09rem] text-red-500 text-sm">
                                        {error.postImage}
                                    </div>
                                )}
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
                        </div>
                    </div>

                    <div className="w-full mt-10">
                        <div className="text-lg font-medium">
                            <span className="text-red-500">* </span>Content :
                        </div>
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

                <div className="drop-shadow-md h-full w-full lg:w-[30%] mt-6 flex flex-col items-center">
                    <div className="w-full flex items-center justify-center">
                        <div className="drop-shadow-md border-[0.01rem] border-gray-500 max-w-[350px] w-full h-[200px] rounded-lg overflow-hidden">
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="thumbnail preview"
                                    className="object-cover h-full w-full"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 h-full w-full">
                                    <div
                                        className="bg-[#f9f9f9] p-2
                                    rounded-full w-fit"
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

                    <div className="border-[0.01rem] border-gray-500 rounded-lg p-6 max-w-[350px] w-full gap-6 mt-8 flex flex-col items-center">
                        <div className="text-xl font-medium text-center">
                            <span className="text-red-500">* </span>Select a
                            Category
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {categoryElements}
                        </div>
                    </div>

                    <div className="w-full text-center mt-7">
                        <Button
                            btnText={loading ? 'Uploading...' : 'Upload'}
                            type="submit"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            className="text-white rounded-md py-2 text-lg w-full max-w-[350px] bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
