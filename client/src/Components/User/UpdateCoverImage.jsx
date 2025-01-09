import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context';
import { fileRestrictions } from '../../Utils';
import { userService } from '../../Services';
import { icons } from '../../Assets/icons';
import { Button } from '..';

export default function UpdateCoverImage({
    className,
    setUpdateCoverImagePopup,
}) {
    const { user, setUser } = useUserContext();
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState({
        coverImage: '',
    });
    const [coverImagePreview, setCoverImagePreview] = useState(
        user.user_coverImage
    );
    const navigate = useNavigate();
    const ref = useRef();

    async function handleChange(e) {
        const { files, name } = e.target;
        if (files[0]) {
            const file = files[0];
            setCoverImage(file);
            fileRestrictions(file, name, setError);

            const reader = new FileReader();

            reader.onloadend = () => {
                setCoverImagePreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    }

    function onMouseOver() {
        if (error.coverImage) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        try {
            const res = await userService.updateCoverImage(coverImage);
            if (res && !res.message) {
                setUser(res);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
            setDisabled(false);
            setUpdateCoverImagePopup(false);
        }
    }

    return (
        <div
            className={`relative bg-orange-200 rounded-xl w-[310px] sm:w-[350px] md:w-[440px] p-4 ${className}`}
        >
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
                            error.coverImage
                                ? 'border-red-500'
                                : 'border-green-500'
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

                    {error.coverImage && (
                        <div className="w-full text-center text-sm text-red-500">
                            {error.coverImage}
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
                    onClick={() => {
                        setUpdateCoverImagePopup(false);
                    }}
                    className="absolute top-1 right-1 bg-transparent"
                />
            </div>
        </div>
    );
}
