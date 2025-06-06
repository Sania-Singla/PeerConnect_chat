import clsx from 'clsx';

export default function Button({
    disabled = false,
    className = '',
    btnText,
    type = 'button',
    defaultStyles = false,
    ...props
}) {
    const defaultButtonStyles =
        'font-normal rounded-md flex items-center justify-center bg-[#4977ec] hover:bg-[#3b62c2]';

    return (
        <button
            type={type}
            disabled={disabled}
            {...props}
            className={clsx(
                'disabled:cursor-not-allowed cursor-pointer',
                defaultStyles && defaultButtonStyles,
                className
            )}
        >
            {btnText}
        </button>
    );
}
