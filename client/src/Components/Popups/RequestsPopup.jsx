import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestService } from '../../Services';
import { useChatContext } from '../../Context';
import { Button } from '..';

export default function RequestsPopup() {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const { setChats } = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getRequests() {
            try {
                setInitialLoading(true);
                const data = await requestService.getMyRequests(
                    'pending',
                    signal
                );
                setRequests(data);
            } catch (err) {
                navigate('/server-error');
            } finally {
                setInitialLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    async function acceptRequest(requestId) {
        try {
            setLoading(true);
            const res = await requestService.acceptRequest(requestId);
            if (res && !res.message) {
                setRequests((prev) =>
                    prev.filter((r) => r.request_id !== requestId)
                );
                setChats((prev) => [...prev, res]);
                toast.success('Request accepted successfully');
            } else toast.error(res.message);
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    async function rejectRequest(requestId) {
        try {
            setLoading(true);
            const res = await requestService.rejectRequest(requestId);
            if (res && res.message === 'request rejected successfully') {
                setRequests((prev) =>
                    prev.filter((r) => r.request_id !== requestId)
                );
                toast.success('Request rejected successfully');
            } else toast.error(res.message);
        } catch (err) {
            navigate('/server-error');
        } finally {
            setLoading(false);
        }
    }

    const requestElements = requests.map(
        ({
            request_id,
            sender: {
                user_avatar,
                user_firstName,
                user_lastName,
                user_name,
                user_id,
            },
        }) => (
            <div
                key={request_id}
                className="flex items-center gap-4 w-full justify-between "
            >
                <NavLink
                    to={`/channel/${user_id}`}
                    className="flex items-center gap-3 overflow-hidden"
                >
                    <div>
                        <img
                            src={user_avatar}
                            alt="user avatar"
                            className="size-[45px] rounded-full"
                        />
                    </div>
                    <div>
                        <p className="truncate">
                            {user_firstName} {user_lastName}
                        </p>
                        <p className="text-sm">@{user_name}</p>
                    </div>
                </NavLink>
                <div className="flex gap-2">
                    <Button
                        btnText={loading ? 'Accepting...' : 'Accept'}
                        onClick={() => acceptRequest(request_id)}
                        className="text-green-600 rounded-md px-2 text-[15px] py-[3px] bg-[#00ff1517]"
                    />
                    <Button
                        btnText={loading ? 'Rejecting...' : 'Reject'}
                        onClick={() => rejectRequest(request_id)}
                        className="text-red-600 rounded-md px-2 text-[15px] py-[3px] bg-[#ff000012]"
                    />
                </div>
            </div>
        )
    );

    return (
        <div className="w-[400px] bg-white p-4 rounded-md drop-shadow-md">
            {initialLoading ? (
                <div>loading...</div>
            ) : requests.length > 0 ? (
                <div className="w-full">{requestElements}</div>
            ) : (
                <div>No Collaboration Requests.</div>
            )}
        </div>
    );
}
