import { useState } from 'react';
import { useUserContext } from '@/Context';
import { verifyExpression } from '@/Utils';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/Services';
import { Button } from '@/Components';
import toast from 'react-hot-toast';

export default function UpdateChannelDetails() {
    const { user, setUser } = useUserContext();
    const initialInputs = {
        userName: user?.user_name,
        bio: user?.user_bio,
        password: '',
    };
    const [inputs, setInputs] = useState(initialInputs);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    async function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    async function handleBlur(e) {
        const { name, value } = e.target;
        if (value && name !== 'password') {
            verifyExpression(name, value, setError);
        }
    }

    async function onMouseOver() {
        if (
            Object.entries(inputs).some(([key, value]) => {
                if (key === 'bio') return false;
                if (key === 'password' && user.auth_provider === 'google')
                    return false;
                return !value;
            }) ||
            Object.entries(error).some(
                ([key, value]) => value && key !== 'password'
            ) ||
            !Object.entries(inputs).some(
                ([key, value]) =>
                    value !== initialInputs[key] && key !== 'password'
            )
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setError({});
        try {
            const res = await userService.updateChannelDetails(inputs);
            if (res && !res.message) {
                setUser(res);
                setInputs((prev) => ({ ...prev, password: '' }));
                toast.success('Channel details updated successfully');
            } else {
                setError((prev) => ({ ...prev, password: res.message }));
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
            setDisabled(false);
        }
    }

    const inputFields = [
        {
            name: 'userName',
            type: 'text',
            placeholder: 'Enter your user name',
            label: 'Username',
            required: true,
            show: true,
        },
        {
            name: 'bio',
            placeholder: 'Add channel bio',
            label: 'Bio',
            required: false,
            show: true,
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Enter your password',
            label: 'Password',
            required: true,
            show: user.auth_provider === 'local',
        },
    ];

    const inputElements = inputFields.map(
        (field) =>
            field.show && (
                <div key={field.name}>
                    <div className="bg-[#f9f9f9] z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                        <label htmlFor={field.name}>
                            {field.label}
                            {field.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>
                    </div>
                    {field.name !== 'bio' ? (
                        <div>
                            <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                value={inputs[field.name]}
                                placeholder={field.placeholder}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required={field.required}
                                className="shadow-md shadow-[#f7f7f7] py-[15px] rounded-[5px] pl-[10px] w-full border-[0.01rem] border-gray-500 bg-transparent"
                            />
                        </div>
                    ) : (
                        <div>
                            <textarea
                                name={field.name}
                                id={field.name}
                                value={inputs[field.name]}
                                placeholder={field.placeholder}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required={field.required}
                                className="shadow-md shadow-[#f7f7f7] py-[15px] rounded-[5px] pl-[10px] w-full border-[0.01rem] border-gray-500 bg-transparent"
                            />
                        </div>
                    )}
                    {error[field.name] && (
                        <div className="pt-[0.09rem] text-red-500 text-sm">
                            {error[field.name]}
                        </div>
                    )}
                </div>
            )
    );

    return (
        <div className="w-full py-2">
            <div className="rounded-xl drop-shadow-md flex flex-col sm:flex-row bg-[#f9f9f9] sm:gap-12 px-4  pt-2 lg:px-8">
                <div className="w-full py-6">
                    <h3 className="text-2xl font-semibold">
                        Update Channel Information
                    </h3>
                    <p className="mt-4">
                        Update your channel details to keep information current.
                        Changes are final once saved.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[600px] pb-6"
                >
                    <div className="flex flex-col gap-4">{inputElements}</div>
                    <div className="flex gap-6 mt-6">
                        <Button
                            btnText="Cancel"
                            onMouseOver={onMouseOver}
                            disabled={loading}
                            onClick={() => {
                                setInputs(initialInputs);
                                setError(nullErrors);
                            }}
                            className="text-white rounded-md py-2 text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                        <Button
                            btnText={loading ? 'Updating...' : 'Update'}
                            type="submit"
                            disabled={disabled}
                            onMouseOver={onMouseOver}
                            className="text-white rounded-md py-2 text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
