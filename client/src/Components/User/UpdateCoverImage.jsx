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
        <div className="relative bg-orange-200 rounded-xl w-[310px] sm:w-[350px] md:w-[440px] p-4">
            <div className="text-black text-xl w-full bg-red-400 text-center font-medium mb-4">
                Update Cover Image
            </div>

            {/* preview */}
            <Button
                btnText={
                    <img
                        alt="preview"
                        src={coverImagePreview}
                        className={`object-cover h-full w-full ${
                            error ? 'border-red-500' : 'border-green-500'
                        } `}
                    />
                }
                onClick={() => ref.current.click()}
                className="h-[160px] md:h-[200px] w-full overflow-hidden rounded-xl"
            />

            <div className="">
                <form onSubmit={handleSubmit} className="">
                    <input
                        type="file"
                        name="coverImage"
                        id="coverImage"
                        className="hidden"
                        onChange={handleChange}
                        ref={ref}
                    />

                    {error && (
                        <div className="w-full text-center text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    {/* sbumit btn */}
                    <div className="w-full flex items-center justify-center mt-4">
                        <Button
                            btnText={loading ? 'Uploading...' : 'Upload'}
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            type="submit"
                        />
                    </div>
                </form>
            </div>

            {/* cross */}
            <div>
                <Button
                    title="Close"
                    btnText={
                        <div className="size-[23px] fill-none stroke-slate-700">
                            {icons.cross}
                        </div>
                    }
                    onClick={() => setShowPopup(false)}
                    className="absolute top-1 right-1 bg-transparent"
                />
            </div>
        </div>
    );
}
