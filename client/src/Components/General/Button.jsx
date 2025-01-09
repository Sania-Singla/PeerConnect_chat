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
            className={`hover:scale-110 transition-all duration-300 disabled:cursor-not-allowed ${className}`}
        >
            {btnText}
        </button>
    );
}
