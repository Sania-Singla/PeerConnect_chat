export default function Client({ username, avatar }) {
    return (
        <div className="flex align-items-center">
            <img
                src={avatar}
                alt={username}
                className="rounded-full size-9 border border-gray-700 mr-2"
            />
            <span className="mx-2 line-clamp-1">{username.toString()}</span>
        </div>
    );
}
