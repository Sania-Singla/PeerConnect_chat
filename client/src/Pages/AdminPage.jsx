import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPostRow, Button } from '@/Components';
import { userService, postService } from '@/Services';
import { useUserContext } from '@/Context';
import { paginate, formatCount } from '@/Utils';
import { LIMIT } from '@/Constants/constants';
import { icons } from '@/Assets/icons';

export default function AdminPage() {
    const { user } = useUserContext();
    const [statsData, setStatsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postsInfo, setPostsInfo] = useState({});
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getChannelProfile() {
            try {
                setLoading(true);
                const res = await userService.getChannelProfile(
                    signal,
                    user.user_id
                );
                if (res && !res.message) {
                    setStatsData(res);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async function getChannelPosts() {
            try {
                setPostsLoading(true);
                const res = await postService.getPosts(
                    signal,
                    user.user_id,
                    LIMIT,
                    page
                );
                if (res && !res.message) {
                    setPosts((prev) => [...prev, ...res.posts]);
                    setPostsInfo(res.postsInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setPostsLoading(false);
            }
        })();

        return () => controller.abort();
    }, [page, user]);

    const stats = [
        {
            name: 'Total Likes',
            value: statsData.totalLikes,
        },
        {
            name: 'Total Views',
            value: statsData.totalChannelViews,
        },
        {
            name: 'Total Posts',
            value: statsData.totalPosts,
        },
        {
            name: 'Total Followers',
            value: statsData.totalFollowers,
        },
    ];

    const tableHeads = [
        'Toggle',
        'Visibility',
        'Post',
        'Category',
        'Date uploaded',
        'Views',
        'Comments',
        'Ratings',
        'Options',
    ];

    const tableHeadElements = tableHeads.map((head) => (
        <th key={head} className="text-[1.13rem] font-bold py-[18px] px-6">
            {head}
        </th>
    ));

    const statElements = stats?.map((item) => (
        <div
            key={item.name}
            className="bg-[#f9f9f9] text-2xl flex items-center justify-between gap-8 rounded-xl h-[120px] p-8 drop-shadow-md overflow-hidden"
        >
            <div className="font-medium">{item.name}</div>
            <div>{formatCount(item.value)}</div>
        </div>
    ));

    // pagination
    const paginateRef = paginate(postsInfo.hasNextPage, postsLoading, setPage);

    const postElements = posts
        ?.filter((post) => {
            const title = post.post_title.toLowerCase();
            if (search && title.includes(search.toLowerCase())) return post;
            if (!search) return post;
        })
        .map((post, index) => (
            <AdminPostRow
                key={post.post_id}
                post={post}
                setPosts={setPosts}
                reference={posts.length === index + 1 ? paginateRef : null}
            />
        ));

    return loading ? (
        <div>loading...</div>
    ) : (
        <div className="px-4 w-full">
            <div className="flex items-center justify-between bg-[#f9f9f9] rounded-xl drop-shadow-md px-6 py-4">
                <div className="">
                    <div className="drop-shadow-md">
                        <div className="size-[125px] overflow-hidden rounded-full">
                            <img
                                src={user.user_avatar}
                                alt="user avatar"
                                className="object-cover size-full"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-medium">
                            Welcome Back, {user.user_fullName}
                        </div>
                        <div className="text-[15px] mt-1 text-black">
                            Track you channel's progress, Seamless post
                            Management & Elevated Results.
                        </div>
                    </div>
                </div>

                <div>
                    <Button
                        btnText={
                            <div className="flex items-center justify-center gap-2">
                                <div className="size-[20px] fill-white">
                                    {icons.plus}
                                </div>
                                <div className="text-white">New Post</div>
                            </div>
                        }
                        onClick={() => navigate('/add')}
                        className="text-white rounded-md p-2 w-full bg-[#4977ec] font-medium hover:bg-[#3b62c2]"
                    />
                </div>
            </div>

            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-x-4 gap-y-7">
                {statElements}
            </div>

            {/* search bar */}
            <div className="relative group drop-shadow-md mt-10 w-full">
                <input
                    type="text"
                    placeholder="Search here"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    id="search"
                    className="max-w-[500px] w-full bg-white border-[#dedede] border-[0.1rem] indent-8 rounded-full p-2 text-black text-[16px] font-normal placeholder:text-[#525252] outline-none focus:border-[#4977ec]"
                />
                <div className="size-[20px] fill-[#434343] group-focus-within:fill-[#4977ec] absolute top-3 left-3">
                    {icons.search}
                </div>
            </div>

            <div className="overflow-x-scroll mt-10 w-full rounded-xl drop-shadow-md">
                <table className="w-full text-nowrap bg-[#f9f9f9] text-[#efefef] border-[0.01rem] rounded-xl overflow-hidden">
                    <thead className="w-full">
                        <tr className="w-full drop-shadow-md bg-[#f9f9f9] text-black">
                            {tableHeadElements}
                        </tr>
                    </thead>

                    <tbody className="text-black">{postElements}</tbody>
                </table>

                {postsLoading &&
                    (page === 1 ? (
                        <div className="w-full text-center">
                            loading first batch...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center my-2 w-full">
                            <div className="size-7 fill-[#4977ec]">
                                {icons.loading}
                            </div>
                            <span className="text-xl ml-3">Please wait...</span>
                        </div>
                    ))}
            </div>
        </div>
    );
}
