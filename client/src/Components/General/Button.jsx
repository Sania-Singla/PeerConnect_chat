export default function Button({
    disabled = false,
    className = '',
    btnText,
    type = 'button',
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            {...props}
            className={`disabled:cursor-not-allowed ${className} text-[15px] font-normal cursor-pointer`}
        >
            {btnText}
        </button>
    );
}
