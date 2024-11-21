import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button, Logout } from '..';
import { useUserContext, useSideBarContext } from '../../Context';
import { LOGO } from '../../Constants/constants';
import { useState } from 'react';
import { icons } from '../../Assets/icons';

export default function Header() {
    const { user } = useUserContext();
    const { setShowSideBar } = useSideBarContext();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const links = [
        { path: '/', name: 'Home' },
        { path: '/about-us', name: 'About Us' },
        { path: '/support', name: 'Support' },
        { path: '/contact-us', name: 'Contact Us' },
    ];
    const linkElements = links.map((link) => (
        <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
                `${isActive ? 'text-[#4977ec]' : 'text-black'} w-full`
            }
        >
            <div className="w-full text-center">{link.name}</div>
        </NavLink>
    ));

    return (
        <div className="fixed top-0 z-[1] w-full bg-[#f6f6f6] text-black h-[60px] px-8 font-medium flex items-center justify-between gap-2">
            <div className="flex items-center justify-center gap-6">
                {/* hamburgur menu btn */}
                <Button
                    btnText={
                        <div className="size-[20px] fill-[#434343] group-hover:fill-[#4977ec]">
                            {icons.hamburgur}
                        </div>
                    }
                    onClick={() => {
                        setShowSideBar((prev) => !prev);
                    }}
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md w-fit"
                />

                {/* logo */}
                <Link
                    to={'/'}
                    className="flex items-center justify-center gap-4 text-nowrap font-medium text-xl"
                >
                    <div className="overflow-hidden rounded-full size-[40px] drop-shadow-md">
                        <img
                            src={LOGO}
                            alt="peer connect logo"
                            className="object-cover size-full hover:brightness-95"
                        />
                    </div>
                    <div>Peer Connect</div>
                </Link>
            </div>

            {/* links */}
            <div className="hidden md:flex items-center justify-evenly w-[40%] px-8">
                {linkElements}
            </div>

            {/* search bar */}
            <div className="hidden relative group drop-shadow-md w-[35%]">
                <input
                    type="text"
                    placeholder="Search here"
                    value={search}
                    onChange={(e) => {}}
                    className="w-full bg-white border-[#d5d5d5] border-[0.01rem] indent-8 rounded-full p-2 text-black text-[16px] font-normal placeholder:text-[#525252] outline-none focus:border-[0.1rem] focus:border-[#4977ec]"
                />
                <div className="size-[20px] fill-[#434343] group-focus-within:fill-[#4977ec] absolute top-3 left-3">
                    {icons.search}
                </div>

                {/* <Button
                    btnText={<div className="text-white">Search</div>}
                    onClick={() => {}}
                    className="absolute right-1 top-[50%] translate-y-[-50%] bg-[#4977ec] px-4 py-[5px] group rounded-full drop-shadow-md hover:bg-[#3b66d2] w-fit"
                /> */}
            </div>

            <div className="flex items-center justify-center gap-4">
                {/* search btn */}
                <Button
                    btnText={
                        <div className="size-[20px] group-hover:fill-[#4977ec] fill-[#434343]">
                            {icons.search}
                        </div>
                    }
                    onClick={() => {}}
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                />

                {/* add post btn */}
                <NavLink
                    to={'/add'}
                    className={({ isActive }) => `${isActive && 'hidden'}`}
                >
                    <Button
                        btnText={
                            <div className="size-[20px] group-hover:fill-[#4977ec] fill-[#434343]">
                                {icons.plus}
                            </div>
                        }
                        onClick={() => {}}
                        className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md hover:drop-shadow-md w-fit"
                    />
                </NavLink>

                <div className="hidden sm:flex">
                    {/* login/logout btn */}
                    {user ? (
                        <Logout />
                    ) : (
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                onClick={() => {
                                    navigate('/register');
                                }}
                                btnText="Sign Up"
                                className="text-white rounded-md py-[5px] w-[80px] bg-[#4977ec] hover:bg-[#3b62c2]"
                            />

                            <Button
                                onClick={() => {
                                    navigate('/login');
                                }}
                                btnText="Login"
                                className="text-white rounded-md py-[5px] w-[80px] bg-[#4977ec] hover:bg-[#3b62c2]"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
