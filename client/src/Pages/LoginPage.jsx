import { useGoogleLogin } from '@react-oauth/google';
import { Button, Login } from '@/Components';
import { IMAGES } from '@/Constants/constants';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/Context';
import toast from 'react-hot-toast';
import { authService } from '@/Services';
import { icons } from '@/Assets/icons';

export default function LoginPage() {
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (tokenResponse) => {
            try {
                const res = await authService.loginWithGoogle({
                    code: tokenResponse.code,
                });
                if (res && !res.message) {
                    setUser(res);
                    navigate('/');
                } else {
                    toast.error(res.message || 'Google login failed');
                }
            } catch (err) {
                toast.error(err.message || 'Google login failed');
            }
        },
        onError: () => toast.error('Google login failed'),
    });

    return (
        <div className="text-black flex justify-center fixed z-[1] bg-white inset-0 p-6 h-screen overflow-scroll">
            <div className="max-w-[350px] w-[60%] flex flex-col items-center my-auto">
                <Link
                    to={'/'}
                    className="w-fit flex items-center justify-center hover:brightness-95 mb-5"
                >
                    <div className="size-[80px]">
                        <img
                            src={IMAGES.logoSvg}
                            alt="peer connect logo"
                            className="size-full"
                        />
                    </div>
                </Link>

                <div className="w-fit">
                    <p className="text-center px-2 text-2xl font-medium">
                        Login to Your Account
                    </p>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.2 }}
                        className="h-[0.1rem] bg-[#333333]"
                    />
                </div>

                <div className="w-full flex items-center justify-center mt-5">
                    <Login />
                </div>

                <div className="w-full flex items-center gap-2">
                    <div className="border-b-1 border-gray-300 w-full" />
                    <div className="mt-3 mb-4 text-gray-400 text-sm">or</div>
                    <div className="border-b-1 border-gray-300 w-full" />
                </div>

                <Button
                    onClick={login}
                    className="hover:bg-gray-100 cursor-pointer w-full rounded-full border border-gray-300 p-[5px]"
                    btnText={
                        <div className="flex items-center justify-center gap-4">
                            <div className="size-8">{icons.google}</div>
                            <div className="text-gray-800">
                                Continue with Google
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
