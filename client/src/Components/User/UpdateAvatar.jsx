import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context';
import { fileRestrictions } from '../../Utils';
import { userService } from '../../Services';
import { icons } from '../../Assets/icons';
import { Button } from '..';

export default function UpdateAvatar({ className, setUpdateAvatarPopup }) {
    const { user, setUser } = useUserContext();
    const [error, setError] = useState({
        avatar: '', // have to take object due to regex util format
    });
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user.user_avatar);
    const [avatar, setAvatar] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();
    const ref = useRef();

    async function handleChange(e) {
        const { files, name } = e.target;
        if (files[0]) {
            const file = files[0];
            setAvatar(file);
            fileRestrictions(file, name, setError);

            const reader = new FileReader();

            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    }

    function onMouseOver() {
        if (error.avatar) {
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
            const res = await userService.updateAvatar(avatar);
            if (res && !res.message) {
                setUser(res);
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
            setDisabled(false);
            setUpdateAvatarPopup(false);
        }
    }

    return (
        <div
            className={`relative w-[300px] bg-orange-200 p-4 rounded-xl ${className}`}
        >
            <div className="w-full text-center text-2xl font-semibold mb-4 text-black">
                Update Avatar
            </div>

            {/* preview */}
            <div className="w-full flex items-center justify-center">
                <Button
                    btnText={
                        <img
                            src={avatarPreview}
                            alt="preview"
                            className={`size-[150px] rounded-full border-[0.2rem] ${
                                error.avatar
                                    ? 'border-red-500'
                                    : 'border-green-500'
                            }`}
                        />
                    }
                    className="rounded-full size-fit overflow-hidden"
                    onClick={() => ref.current.click()}
                />
            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        className="hidden"
                        onChange={handleChange}
                        ref={ref}
                    />

                    {error.avatar && (
                        <div className="text-sm mt-4 px-2 text-red-500 w-full text-center">
                            {error.avatar}
                        </div>
                    )}

                    {/* upload btn */}
                    <div className="w-full mt-4 flex items-center justify-center">
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
            <Button
                title="Close"
                btnText={
                    <div className="size-[23px] fill-none stroke-slate-700">
                        {icons.cross}
                    </div>
                }
                onClick={() => {
                    setUpdateAvatarPopup(false);
                }}
                className="absolute top-1 right-1 bg-transparent"
            />
        </div>
    );
}
