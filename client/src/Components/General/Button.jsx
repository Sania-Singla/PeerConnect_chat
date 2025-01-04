export default function Button({
    disabled = false,
    className = '',
    btnText,
    ...props
}) {
    return (
        <button
            disabled={disabled}
            {...props}
            className={`hover:scale-110 transition-all duration-300 disabled:cursor-not-allowed ${className}`}
        >
            {btnText}
        </button>
    );
}
