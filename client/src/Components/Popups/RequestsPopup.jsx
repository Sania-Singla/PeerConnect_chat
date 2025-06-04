import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestService } from '@/Services';
import { Button } from '@/Components';
import { icons } from '@/Assets/icons';
import { useChatContext } from '@/Context';

export default function RequestsPopup() {
    const [targetRequest, setTargetRequest] = useState({
        requestId: '',
        status: '',
    });
    const { requests, setRequests } = useChatContext();
    const navigate = useNavigate();

    async function acceptRequest(requestId) {
        try {
            setTargetRequest({ requestId, status: 'accepting' });
            const res = await requestService.acceptRequest(requestId);
            if (res && !res.message) {
                setRequests((prev) =>
                    prev.filter((r) => r.request_id !== requestId)
                );

                toast.success('Request accepted successfully');
            } else toast.error(res.message);
        } catch (err) {
            navigate('/server-error');
        } finally {
            setTargetRequest({ requestId: '', status: '' });
        }
    }

    async function rejectRequest(requestId) {
        try {
            setTargetRequest({ requestId, status: 'rejecting' });
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
            setTargetRequest({ requestId: '', status: '' });
        }
    }

    const requestElements = requests.map(
        ({
            request_id,
            sender: { user_avatar, user_fullName, user_name, user_id },
        }) => (
            <div
                key={request_id}
                className="hover:backdrop-brightness-95 rounded-md p-2 flex items-center gap-4 justify-between"
            >
                <NavLink
                    to={`/channel/${user_id}`}
                    className="flex items-center gap-3 overflow-hidden"
                >
                    <div className="size-[45px]">
                        <img
                            src={user_avatar}
                            alt="user avatar"
                            className="size-full rounded-full"
                        />
                    </div>
                    <div className="overflow-hidden flex-1">
                        <p className="truncate">{user_fullName}</p>
                        <p className="text-sm">@{user_name}</p>
                    </div>
                </NavLink>
                <div className="flex gap-2">
                    <Button
                        btnText={
                            targetRequest.requestId === request_id &&
                            targetRequest.status === 'accepting' ? (
                                <div className="flex items-center justify-center">
                                    <div className="size-[20px] fill-green-600 dark:text-[#ececec]">
                                        {icons.loading}
                                    </div>
                                </div>
                            ) : (
                                'Accept'
                            )
                        }
                        onClick={() => acceptRequest(request_id)}
                        className="text-green-600 rounded-md text-[15px] w-[60px] py-[3px] bg-[#00ff1517]"
                    />
                    <Button
                        btnText={
                            targetRequest.requestId === request_id &&
                            targetRequest.status === 'rejecting' ? (
                                <div className="flex items-center justify-center">
                                    <div className="size-[20px] fill-red-600 dark:text-[#ececec]">
                                        {icons.loading}
                                    </div>
                                </div>
                            ) : (
                                'Reject'
                            )
                        }
                        onClick={() => rejectRequest(request_id)}
                        className="text-red-600 rounded-md w-[60px] text-[15px] py-[3px] bg-[#ff000012]"
                    />
                </div>
            </div>
        )
    );

    return (
        <div className="w-[400px] bg-white p-4 rounded-md drop-shadow-md">
            {requests.length > 0 ? (
                <div className="w-full flex flex-col gap-4">
                    {requestElements}
                </div>
            ) : (
                <div className="text-sm italic text-gray-500">
                    No Collaboration Requests.
                </div>
            )}
        </div>
    );
}
