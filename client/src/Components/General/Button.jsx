export default function Button({
    disabled = false,
    className = '',
    btnText,
    type = 'button',
    defaultStyles = false,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            {...props}
            className={`disabled:cursor-not-allowed text-[15px] font-normal cursor-pointer ${className} ${defaultStyles && 'text-white rounded-md flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2]'}`}
        >
            {btnText}
        </button>
    );
}
