import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context';
import { authService } from '../../Services';
import { Button } from '..';
import { icons } from '../../Assets/icons';
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
                toast.success('LogOut Successfull 🙂');
            }
        } catch (err) {
            navigate('/servor-error');
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
                    <div className="size-5 fill-[#4977ec] dark:text-[#a2bdff]">
                        {icons.loading}
                    </div>
                ) : (
                    'Logout'
                )
            }
            className="text-white rounded-md py-[5px] flex items-center justify-center h-[35px] w-[80px] bg-[#4977ec] hover:bg-[#3b62c2]"
        />
    );
}
