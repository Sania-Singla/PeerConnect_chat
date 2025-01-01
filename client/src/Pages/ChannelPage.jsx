import { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink, Outlet } from 'react-router-dom';
import { Button } from '../Components';
import { userService, followerService } from '../Services';
import { useChannelContext, useUserContext, usePopupContext } from '../Context';

export default function ChannelPage() {
    const { userName } = useParams();
    const navigate = useNavigate();
    const { channel, setChannel } = useChannelContext();
    const { user } = useUserContext();
    const [loading, setLoading] = useState(true);
    const { setShowLoginPopup, setLoginPopupText } = usePopupContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getChannelProfile() {
            try {
                setLoading(true);
                const res = await userService.getChannelProfile(
                    signal,
                    userName
                );
                if (res && !res.message) {
                    setChannel(res);
                } else {
                    setChannel(null);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [userName, user]);

    async function toggleFollow() {
        try {
            if (!user) {
                setShowLoginPopup(true);
                setLoginPopupText('Follow');
                return;
            }
            const res = await followerService.toggleFollow(channel.user_id);
            if (res && res.message === 'FOLLOW_TOGGLED_SUCCESSFULLY') {
                setChannel((prev) => ({
                    ...prev,
                    isFollowed: !prev.isFollowed,
                }));
            }
        } catch (err) {
            navigate('/server-error');
        }
    }

    const tabs = [
        { name: 'posts', path: '' },
        { name: 'About', path: 'about' },
    ];

    const tabElements = tabs?.map((tab) => (
        <NavLink
            key={tab.name}
            to={tab.path}
            end
            className={({ isActive }) =>
                `${isActive ? 'border-b-[#4977ec] bg-[#4977ec] text-white' : 'border-b-black bg-[#f9f9f9] text-black'} drop-shadow-md hover:backdrop-brightness-90 rounded-t-md p-[3px] border-b-[0.1rem] w-full text-center text-lg font-medium`
            }
        >
            <div className="w-full text-center">{tab.name}</div>
        </NavLink>
    ));

    return loading ? (
        <div>loading...</div>
    ) : channel ? (
        <div className="w-full h-full">
            {/* owner coverImage */}
            <div className="w-full h-[180px] overflow-hidden rounded-xl drop-shadow-md">
                <img
                    src={channel.user_coverImage}
                    alt="channel coverImage"
                    className="object-cover h-full w-full"
                />
            </div>

            {/* owner info */}
            <div className="flex items-center justify-between w-full pr-8 relative ">
                <div className="flex items-center justify-start gap-4">
                    {/* owner avatar */}
                    <div className="relative -top-8 flex gap-2 items-center justify-start">
                        <div className="relative">
                            <div className="rounded-full  overflow-hidden size-[140px] border-[0.5rem] border-white ">
                                <img
                                    alt="user avatar"
                                    src={channel.user_avatar}
                                    className="size-full object-cover drop-shadow-md"
                                />
                            </div>
                        </div>

                        {/* channel info*/}
                        <div className="flex flex-col items-start justify-center mt-6">
                            <div className="text-3xl font-medium">
                                {channel.user_firstName} {channel.user_lastName}
                            </div>
                            <div className="text-lg text-[#151515]">
                                @{channel.user_name}
                            </div>
                            <div className="flex gap-1 items-center justify-start text-[#3f3f3f] text-[16px]">
                                {channel.totalFollowers} followers &bull;{' '}
                                {channel.totalFollowings} followings
                            </div>
                        </div>
                    </div>
                </div>

                {/* follow/edit btn */}
                {user?.user_name === channel.user_name ? (
                    <div className="">
                        <Button
                            btnText="Edit"
                            onClick={() => {
                                navigate('/settings');
                            }}
                            className="rounded-md text-white py-[5px] px-4 bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                ) : (
                    <div className="">
                        <Button
                            btnText={channel.isFollowed ? 'UnFollow' : 'Follow'}
                            onClick={toggleFollow}
                            className="rounded-md text-white py-[5px] px-4 bg-[#4977ec] hover:bg-[#3b62c2]"
                        />
                    </div>
                )}
            </div>

            {/* tabs */}
            <div className="flex gap-2 justify-evenly w-full px-2">
                {tabElements}
            </div>

            <div className="w-full mt-6">
                <Outlet />
            </div>
        </div>
    ) : (
        <div>Channel Not Found !!</div>
    );
}
