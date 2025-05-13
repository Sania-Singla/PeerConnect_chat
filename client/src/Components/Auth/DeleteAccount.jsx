import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { usePopupContext, useUserContext } from '@/Context';
import { authService } from '@/Services';
import { Button } from '@/Components';
import toast from 'react-hot-toast';

export default function DeleteAccount() {
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserContext();
    const { setShowPopup } = usePopupContext();
    const navigate = useNavigate();
    const [check, setCheck] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [password, setPassword] = useState('');

    async function handleClick() {
        setLoading(true);
        setDisabled(true);
        try {
            const res = await authService.deleteAccount(password);
            if (res && res.message === 'account deleted successfully') {
                setUser(null);
                toast.success('Account Deleted Successfully 😕');
            } else {
                toast.error(res?.message);
            }
        } catch (err) {
            navigate('/servor-error');
        } finally {
            setDisabled(false);
            setLoading(false);
            setShowPopup(false);
        }
    }

    function onMouseOver() {
        if (!check || !password) setDisabled(true);
        else setDisabled(false);
    }

    return (
        <div>
            <div>
                <div>
                    <input
                        type="checkbox"
                        checked={check}
                        onChange={(e) => setCheck(e.target.checked)}
                        name="deleteCheckBox"
                        id="deleteCheckBox"
                    />
                    <label htmlFor="deleteCheckBox">
                        are you sure you want to delete the account permanently
                        ?
                    </label>
                </div>

                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        id="password"
                        placeholder="Enter your password to confirm delete"
                        className="text-black"
                    />
                </div>
            </div>

            <div>
                <Button
                    onMouseOver={onMouseOver}
                    disabled={disabled}
                    onClick={handleClick}
                    btnText={loading ? 'Deleting...' : 'Delete'}
                />
            </div>
        </div>
    );
}
