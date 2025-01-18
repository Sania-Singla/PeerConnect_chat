import { Button } from '..';
import { icons } from '../../Assets/icons';
import { useSideBarContext } from '../../Context';
import { LOGO } from '../../Constants/constants';
import { Link } from 'react-router-dom';

export default function ChatNavbar() {
    const { setShowSideBar } = useSideBarContext();

    const navIcons = [
        {
            icon: icons.bell,
            title: 'Requests',
            onClick: () => {},
        },
        {
            icon: icons.group,
            title: 'Groups',
            onClick: () => {},
        },
    ];

    const iconElements = navIcons.map(({ title, icon, onClick }) => (
        <Button
            key={title}
            title={title}
            btnText={
                <div className="size-[20px] fill-[#434343] group-hover:fill-[#4977ec]">
                    {icon}
                </div>
            }
            className="bg-[#ffffff] p-[10px] group rounded-full group drop-shadow-md w-fit"
            onClick={onClick}
        />
    ));

    return (
        <div className="bg-[#f6f6f6] h-[60px] px-3 flex items-center justify-between gap-4 drop-shadow-md">
            <div className="flex items-center gap-4">
                {/* hamburgur menu btn */}
                <Button
                    btnText={
                        <div className="size-[20px] fill-[#434343] group-hover:fill-[#4977ec]">
                            {icons.hamburgur}
                        </div>
                    }
                    title="Show Sidebar"
                    onClick={() => {
                        setShowSideBar((prev) => !prev);
                    }}
                    className="bg-[#ffffff] p-[10px] group rounded-full drop-shadow-md w-fit"
                />

                {/* logo */}
                <Link
                    to={'/'}
                    className="flex items-center gap-3 text-nowrap font-medium text-xl"
                >
                    <div className="overflow-hidden rounded-full size-[40px] drop-shadow-md hover:scale-110 transition-all duration-300">
                        <img
                            src={LOGO}
                            alt="peer connect logo"
                            className="object-cover size-full hover:brightness-95"
                        />
                    </div>
                    <div className="hidden xs:block hover:scale-110 transition-all duration-300">
                        PeerConnect
                    </div>
                </Link>
            </div>

            <div className="flex items-center gap-4">{iconElements}</div>
        </div>
    );
}
