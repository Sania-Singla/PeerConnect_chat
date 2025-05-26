import Avatar from 'react-avatar';

export default function Client({ username, avatar }) {
    return (
        <div className="flex align-items-center">
            {avatar ? (
                <img
                    src={avatar}
                    alt={username}
                    className="rounded-full size-9 border border-gray-700 mr-2"
                />
            ) : (
                <Avatar
                    name={username.toString()}
                    size={50}
                    round="14px"
                    className="mr-3"
                />
            )}
            <span className="mx-2 line-clamp-1">{username.toString()}</span>
        </div>
    );
}
