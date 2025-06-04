import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/Context';
import { authService } from '@/Services';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';

export default function Logout() {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

    async function handleClick() {
        setLoading(true);
        try {
            const res = await authService.logout();
            if (res && res.message === 'user loggedout successfully') {
                setUser(null);
                toast.success('Logged out Successfully 🙂');
            }
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            btnText={
                loading ? (
                                        <div className="size-5 fill-white dark:text-[#c5d5ff]">
                        {icons.loading}
                    </div>
                ) : (
                    'Logout'
                )
            }
            className="text-white flex items-center justify-center rounded-md w-[75px] h-[32px] bg-[#4977ec] hover:bg-[#3b62c2]"
        />
    );
}
