export default function NoChatSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center">
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-24 h-24 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M16 10h.01M12 18h.01M8 14h.01M12 14h.01M16 14h.01M7.992 6.436a.75.75 0 01-.992-1.113 9 9 0 0112.586 0 .75.75 0 01-.992 1.113 7.5 7.5 0 00-10.602 0z"
        />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Text */}
      <h2 className="mt-6 text-xl font-semibold text-gray-700">
        No Chat Selected
      </h2>
      <p className="mt-2 text-gray-500">
        Select a chat to start messaging, or create a new chat.
      </p>
    </div>
  );
}
