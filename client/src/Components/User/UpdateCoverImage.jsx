import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopupContext, useUserContext } from '@/Context';
import { fileRestrictions } from '@/Utils';
import { userService } from '@/Services';
import { icons } from '@/Assets/icons';
import { Button } from '@/Components';
import { MAX_FILE_SIZE } from '@/Constants/constants';
import toast from 'react-hot-toast';

export default function UpdateCoverImage() {
    const { user, setUser } = useUserContext();
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');
    const { setShowPopup } = usePopupContext();
    const [coverImagePreview, setCoverImagePreview] = useState(
        user.user_coverImage
    );
    const navigate = useNavigate();
    const ref = useRef();

    async function handleChange(e) {
        const { files } = e.target;
        if (files[0]) {
            const file = files[0];
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));

            if (!fileRestrictions(file)) {
                setError(
                    `only png, jpg/jpeg files are allowed and File size should not exceed ${MAX_FILE_SIZE} MB.`
                );
            } else setError('');
        }
    }

    function onMouseOver() {
        if (error) setDisabled(true);
        else setDisabled(false);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        try {
            const res = await userService.updateCoverImage(coverImage);
            if (res && !res.message) {
                setUser(res);
                toast.success('CoverImage updated successfully');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
            setDisabled(false);
            setShowPopup(false);
        }
    }

    return (
        <div className="relative w-[310px] sm:w-[350px] md:w-[440px] bg-white rounded-2xl shadow-lg p-4">
            <div className="text-black text-xl text-center font-semibold mb-4">
                Update Cover Image
            </div>

            {/* preview */}
            <Button
                onClick={() => ref.current.click()}
                className="h-[160px] md:h-[200px] w-full border shadow-sm overflow-hidden rounded-xl"
                btnText={
                    coverImagePreview ? (
                        <img
                            src={coverImagePreview}
                            alt="Thumbnail Preview"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <div className="flex items-center justify-center size-10 text-gray-400">
                                {icons.image}
                            </div>
                        </div>
                    )
                }
            />

            <div>
                <form onSubmit={handleSubmit} className="w-full mt-4">
                    <input
                        type="file"
                        name="coverImage"
                        id="coverImage"
                        className="hidden"
                        onChange={handleChange}
                        ref={ref}
                    />
                    {error && (
                        <div className="w-full text-center text-sm text-red-500 mt-2">
                            {error}
                        </div>
                    )}
                    <div className="w-full flex justify-center mt-4">
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
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            type="submit"
                            className={`text-white rounded-md w-[100px] h-[36px] text-sm transition-all duration-200 ${
                                disabled
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#4977ec] hover:bg-[#3b62c2]'
                            }`}
                        />
                    </div>
                </form>
            </div>

            {/* cross */}
            <div className="absolute top-3 right-4">
                <Button
                    title="Close"
                    btnText={
                        <div className="size-[20px] fill-none stroke-slate-700">
                            {icons.cross}
                        </div>
                    }
                    onClick={() => setShowPopup(false)}
                    className="bg-transparent hover:scale-110 transition-transform duration-200"
                />
            </div>
        </div>
    );
}
