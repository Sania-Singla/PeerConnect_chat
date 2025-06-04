import { useState } from 'react';
import { authService } from '@/Services';
import { useUserContext } from '@/Context';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/Components';
import { verifyExpression } from '@/Utils';
import { LOGO } from '@/Constants/constants';
import { motion } from 'framer-motion';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [inputs, setInputs] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState({});
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleChange(e) {
        const { value, name } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    }

    const handleBlur = (e) => {
        let { name, value } = e.target;
        if (value) verifyExpression(name, value, setError);
    };

    function onMouseOver() {
        if (
            Object.values(inputs).some((value) => !value) ||
            Object.entries(error).some(
                ([key, value]) => value && key !== 'root'
            )
        ) {
            setDisabled(true);
        } else setDisabled(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError((prev) => ({ ...prev, root: '' }));
        setDisabled(true);
        try {
            const res = await authService.register(inputs);
            if (res && !res.message) {
                setUser(res);
                toast.success('Account created successfully');
                navigate('/');
            } else setError((prev) => ({ ...prev, root: res.message }));
        } catch (err) {
            console.log(err);
            navigate('/server-error');
        } finally {
            setDisabled(false);
            setLoading(false);
        }
    }

    const inputFields = [
        {
            type: 'text',
            name: 'userName',
            label: 'Username',
            placeholder: 'Enter user name',
            required: true,
        },
        {
            type: 'text',
            name: 'fullName',
            label: 'Full Name',
            placeholder: 'Enter first name',
            required: true,
        },
        {
            type: 'text',
            name: 'email',
            label: 'Email',
            placeholder: 'Enter email',
            required: true,
        },
        {
            type: showPassword ? 'text' : 'password',
            name: 'password',
            label: 'Password',
            placeholder: 'Create password',
            required: true,
        },
    ];

    const inputElements = inputFields.map((field) => (
        <div key={field.name} className="w-full">
            <div className="bg-white z-[1] ml-2 px-1 text-[15px] w-fit relative top-[11px] font-medium">
                <label htmlFor={field.name}>
                    {field.required && (
                        <span className="text-red-500 text-sm">* </span>
                    )}
                    {field.label} :
                </label>
            </div>
            <div className="relative">
                <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={inputs[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={field.placeholder}
                    className="shadow-sm shadow-[#f7f7f7] py-3 rounded-[5px] placeholder:text-sm placeholder:text-gray-400 indent-3 w-full border-[0.01rem] border-gray-500 bg-transparent"
                />
                {field.name === 'password' && (
                    <div
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="size-[20px] absolute right-0 top-[50%] transform translate-y-[-50%] mr-4 cursor-pointer fill-[#474747]"
                    >
                        {showPassword ? icons.eyeOff : icons.eye}
                    </div>
                )}
            </div>
            {error[field.name] && (
                <div className="mt-1 text-red-500 text-sm font-medium">
                    {error[field.name]}
                </div>
            )}
            {field.name === 'password' && !error.password && (
                <div className="text-xs italic text-gray-500 mt-1">
                    password must be 8-12 characters.
                </div>
            )}
        </div>
    ));

    return (
        <div className="text-black flex items-center justify-center fixed z-[1] bg-white inset-0">
            <div className="max-w-[350px] w-[50%] flex flex-col items-center justify-center">
                <Link
                    to={'/'}
                    className="w-fit flex items-center justify-center hover:brightness-95 mb-4"
                >
                    <div className="overflow-hidden rounded-full size-[80px] drop-shadow-sm">
                        <img
                            src={LOGO}
                            alt="peer connect logo"
                            className="object-cover size-full"
                        />
                    </div>
                </Link>
                <div className="w-fit">
                    <p className="text-center px-2 text-2xl font-medium">
                        Create a new Account
                    </p>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.2 }}
                        className="h-[0.1rem] bg-[#333333]"
                    />
                    <p className="w-full text-center mt-5 text-[15px]">
                        already have an Account ?{' '}
                        <Link
                            to={'/login'}
                            className="text-[#355ab6] hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>

                <div className="px-8 w-[400px] flex flex-col mt-4 items-center justify-center gap-3">
                    {error.root && (
                        <div className="text-red-500 text-sm font-semibold w-full text-center">
                            {error.root}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-start justify-center gap-2 w-full"
                    >
                        {inputElements}

                        <div className="w-full">
                            <Button
                                type="submit"
                                className="text-white rounded-md py-2 mt-4 h-[45px] flex items-center justify-center text-lg w-full bg-[#4977ec] hover:bg-[#3b62c2]"
                                disabled={disabled}
                                onMouseOver={onMouseOver}
                                btnText={
                                    loading ? (
                                        <div className="size-5 fill-white dark:text-[#c5d5ff]">
                                            {icons.loading}
                                        </div>
                                    ) : (
                                        'Sign Up'
                                    )
                                }
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
