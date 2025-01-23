import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useChatContext, useUserContext } from '../../Context';
import { useState } from 'react';
import { icons } from '../../Assets/icons';
import { Button } from '..';
import { chatService } from '../../Services';
import toast from 'react-hot-toast';

export default function Members() {
    const { selectedChat, setSelectedChat } = useChatContext();
    const navigate = useNavigate();
    const { chatId } = useParams();
    const { user } = useUserContext();
    const [search, setSearch] = useState('');
    const myRole = selectedChat.members.find(
        (m) => m.user_id === user.user_id
    ).role;

    async function addMembers() {
        try {
            // select members
            // call service
            // append in selected chat's members
        } catch (err) {
            navigate('/server-error');
        }
    }

    async function handleRemove(userId) {
        try {
            const res = await chatService.removeMember(chatId, userId);
            if (res && !res.message) {
                setSelectedChat((prev) => ({
                    ...prev,
                    members: prev.members.filter((m) => m.user_id !== userId),
                }));
                toast.success('Member removed successfully');
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    const memberElements = selectedChat?.members
        .filter((m) => {
            if (
                !search.trim() ||
                m.user_firstName
                    .toLowerCase()
                    .includes(search.trim().toLowerCase()) ||
                m.user_lastName
                    .toLowerCase()
                    .includes(search.trim().toLowerCase())
            ) {
                return m;
            }
        })
        .map(
            ({
                user_id,
                user_avatar,
                role,
                user_firstName,
                user_lastName,
                user_bio,
            }) => (
                <NavLink
                    key={user_id}
                    to={`/channel/${user_id}`}
                    className="cursor-pointer hover:backdrop-brightness-95 rounded-md px-3 py-2 flex justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-[45px] rounded-full overflow-hidden">
                            <img
                                src={user_avatar}
                                alt="member avatar"
                                className="object-cover size-full rounded-full"
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user_id === user.user_id
                                    ? 'You'
                                    : `${user_firstName} ${user_lastName}`}
                            </p>

                            <div className="flex justify-between w-full gap-4">
                                <p className="text-xs text-gray-800 truncate">
                                    {user_bio}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {role === 'admin' && (
                            <p className="text-sm text-end text-gray-900">
                                Admin
                            </p>
                        )}
                        {role !== 'admin' && myRole === 'admin' && (
                            <Button
                                title="remove"
                                btnText="Remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(user_id);
                                }}
                                className="text-red-600 rounded-md px-2 text-[15px] py-[3px] bg-[#ff00001d]"
                            />
                        )}
                    </div>
                </NavLink>
            )
        );

    return (
        <div className="px-3">
            {/* Search Bar */}
            <div className="relative my-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search or start new chat"
                    className="placeholder:text-[14px] placeholder:text-[#8e8e8e] border border-b-[0.15rem] focus:border-b-[#4977ec] w-full indent-9 pr-3 py-[4px] bg-[#fbfbfb] focus:bg-white rounded-md focus:outline-none"
                />
                <div className="size-[15px] rotate-90 fill-[#bfbdcf9d] absolute left-3 top-[50%] transform translate-y-[-50%]">
                    {icons.search}
                </div>
            </div>

            <div>
                {myRole === 'admin' && (
                    <div className="px-3 py-2 rounded-md cursor-pointer flex hover:backdrop-brightness-95 items-center gap-4">
                        <div className="p-2 size-[45px] bg-[#d5d5d5] border-[0.01rem] border-gray-400 rounded-full">
                            <div className="ml-[4px] mt-[3px] size-[22px] fill-[#2d2d2d]">
                                {icons.memberAdd}
                            </div>
                        </div>
                        <div onClick={addMembers}>
                            <p className="text-sm font-medium text-gray-900">
                                Add members
                            </p>

                            <p className="text-xs text-gray-800">
                                maximum size is 100
                            </p>
                        </div>
                    </div>
                )}
                {memberElements}
            </div>
        </div>
    );
}
