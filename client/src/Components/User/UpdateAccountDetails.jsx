import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/Context';
import { verifyExpression } from '@/Utils';
import { userService } from '@/Services';
import { Button } from '@/Components';
import toast from 'react-hot-toast';

export default function UpdateAccountDetails() {
    const { user, setUser } = useUserContext();
    const initialInputs = {
        fullName: user?.user_fullName,
        email: user?.user_email,
        password: '',
    };
    const [inputs, setInputs] = useState(initialInputs);
    const [error, setError] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    function handleBlur(e) {
        const { name, value } = e.target;
        if (value && name !== 'password') {
            // we don't want to show error on password
            verifyExpression(name, value, setError);
        }
    }

    function onMouseOver() {
        if (
            Object.entries(inputs).some(([key, value]) => {
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
        } else setDisabled(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setDisabled(true);
        setError({});
        try {
            const res = await userService.updateAccountDetails(inputs);
            if (res && !res.message) {
                setUser(res);
                setInputs((prev) => ({ ...prev, password: '' }));
                toast.success('Account details updated successfully');
            } else {
                setError((prev) => ({ ...prev, password: res.message }));
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    const inputFields = [
        {
            name: 'email',
            type: 'text',
            placeholder: 'Enter your email',
            label: 'Email',
            required: true,
            show: true,
        },
        {
            name: 'fullName',
            type: 'text',
            placeholder: 'Enter your full name',
            label: 'Full Name',
            required: true,
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
                <div key={field.name} className="w-full">
                    <div className="bg-[#f9f9f9] z-[1] ml-3 px-2 w-fit relative top-3 font-medium">
                        <label htmlFor={field.name}>
                            {field.label}
                            {field.required && (
                                <span className="text-red-500">*</span>
                            )}
                        </label>
                    </div>
                    <div>
                        <input
                            type={field.type}
                            name={field.name}
                            id={field.name}
                            placeholder={field.placeholder}
                            value={inputs[field.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required={field.required}
                            className="shadow-md shadow-[#f7f7f7] py-[15px] rounded-[5px] pl-[10px] w-full border-[0.01rem] border-gray-500 bg-transparent"
                        />
                    </div>
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
            <div className="rounded-xl drop-shadow-md flex flex-col sm:flex-row bg-[#f9f9f9] sm:gap-12 px-4 pt-2 lg:px-8">
                <div className="w-full py-6">
                    <h3 className="text-2xl font-semibold">
                        Update Personal Information
                    </h3>
                    <p className="mt-4">
                        Update your personal details here. Please note that
                        changes cannot be undone.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[600px] pb-6"
                >
                    <div className="flex flex-col gap-4">{inputElements}</div>
                    <div className="flex gap-6 mt-6">
                        <Button
                            onMouseOver={onMouseOver}
                            btnText="Cancel"
                            onClick={() => {
                                setInputs(initialInputs);
                                setError(nullErrors);
                            }}
                            disabled={loading}
                            className="text-white rounded-md py-2 text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                        <Button
                            btnText={loading ? 'Updating...' : 'Update'}
                            disabled={disabled}
                            type="submit"
                            onMouseOver={onMouseOver}
                            className="text-white rounded-md py-2 text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
