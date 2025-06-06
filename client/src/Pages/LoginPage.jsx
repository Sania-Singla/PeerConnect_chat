import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Login } from '@/Components';
import { IMAGES } from '@/Constants/constants';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/Context';
import toast from 'react-hot-toast';
import { authService } from '@/Services';

export default function LoginPage() {
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    const handleGoogleLogin = async (credentialRes) => {
        try {
            const res = await authService.loginWithGoogle(
                credentialRes.credential
            );
            if (res && !res.message) {
                setUser(res);
                navigate('/');
            } else {
                toast.error(res.message || 'Google login failed');
            }
        } catch (err) {
            toast.error(err.message || 'Google login failed');
        }
    };

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div className="text-black flex justify-center fixed z-[1] bg-white inset-0 p-6 h-screen overflow-scroll">
                <div className="max-w-[350px] w-[60%] flex flex-col items-center my-auto">
                    <Link
                        to={'/'}
                        className="w-fit flex items-center justify-center hover:brightness-95 mb-6"
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

                    <div className="mt-3 mb-4">OR</div>

                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => toast.error('Google login failed')}
                        containerProps={{
                            style: {
                                width: '100%',
                            },
                        }}
                        theme="filled_blue"
                        text="continue_with"
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
