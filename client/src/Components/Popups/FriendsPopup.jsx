import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePopupContext } from '@/Context';
import { chatService } from '@/Services';
import { icons } from '@/Assets/icons';
import toast from 'react-hot-toast';
import { Button } from '@/Components';

export default function FriendsPopup() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState('');
    const { setShowPopup } = usePopupContext();
    const navigate = useNavigate();
    const [chatName, setChatName] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getFriends() {
            try {
                setLoading(true);
                const data = await chatService.getMyFriends(signal);
                setFriends(data);
            } catch (error) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    async function createGroup() {
        if (!chatName.trim()) {
            toast.error('Please enter a group name');
            return;
        }
        try {
            setAdding(true);
            const res = await chatService.createGroup(chatName, members);
            if (res && !res.message) {
                toast.success('Group Created successfully');
            } else toast.error(res.message);
        } catch (err) {
            navigate('/server-error');
        } finally {
            setAdding(false);
            setShowPopup(false);
            setMembers([]);
        }
    }

    const friendElements = friends
        .filter(
            ({ user_fullName, user_name }) =>
                !search.trim() ||
                user_fullName
                    .toLowerCase()
                    .includes(search.trim().toLowerCase()) ||
                user_name.toLowerCase().includes(search.trim().toLowerCase())
        )
        .map(({ user_avatar, user_fullName, user_id, user_bio }) => (
            <label
                htmlFor={user_id}
                key={user_id}
                className="cursor-pointer flex items-center gap-4 hover:backdrop-brightness-95 rounded-md p-2"
            >
                <input
                    type="checkbox"
                    className="size-4"
                    id={user_id}
                    checked={members.includes(user_id)}
                    onChange={(e) => {
                        e.target.checked
                            ? setMembers((prev) => prev.concat(user_id))
                            : setMembers((prev) =>
                                  prev.filter((id) => id !== user_id)
                              );
                    }}
                />

                <div className="flex gap-3 items-center cursor-pointer w-full">
                    <div>
                        <img
                            src={user_avatar}
                            alt="user avatar"
                            className="rounded-full size-[40px] border object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="truncate font-medium leading-tight text-gray-800">
                            {user_fullName}
                        </p>
                        <p className="text-xs leading-tight text-gray-700">
                            {user_bio}
                        </p>
                    </div>
                </div>
            </label>
        ));

    return (
        <div className="w-[400px] bg-white p-4 rounded-md drop-shadow-md">
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="size-[22px] fill-[#4977ec] dark:text-[#ececec]">
                        {icons.loading}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="w-full gap-2">
                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search here"
                                className="placeholder:text-[14px] font-normal placeholder:text-[#8e8e8e] border-gray-200 border-b-[0.15rem] border-[0.06rem] focus:border-b-[#4977ec] w-full indent-9 pr-3 py-[4px] bg-[#fbfbfb] focus:bg-white rounded-md focus:outline-none"
                            />
                            <div className="size-[15px] rotate-90 fill-[#bfbdcf9d] absolute left-3 top-[50%] transform translate-y-[-50%]">
                                {icons.search}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {members.length > 0 && (
                                <div className="relative mb-4 flex-1">
                                    <input
                                        type="text"
                                        value={chatName}
                                        onChange={(e) =>
                                            setChatName(e.target.value)
                                        }
                                        placeholder="Enter group name"
                                        className="placeholder:text-[14px] font-normal placeholder:text-[#8e8e8e] border-gray-200 border-b-[0.15rem] border-[0.06rem] focus:border-b-[#4977ec] w-full indent-9 pr-3 py-[4px] bg-[#fbfbfb] focus:bg-white rounded-md focus:outline-none"
                                    />
                                    <div className="size-[15px] fill-[#aeadb69d] absolute left-3 top-[50%] transform translate-y-[-50%]">
                                        {icons.group}
                                    </div>
                                </div>
                            )}

                            {members.length > 0 && (
                                <Button
                                    btnText={adding ? 'Adding...' : 'Add'}
                                    className="bg-green-500 mb-4 text-white rounded-md w-[80px]"
                                    onClick={createGroup}
                                    disabled={loading}
                                />
                            )}
                        </div>
                    </div>

                    {friendElements}
                </div>
            )}
        </div>
    );
}
