export default function Input({
    type,
    name,
    label,
    value,
    onChange,
    required,
    className,
    placeholder,
    options,
    errors,
    ...props
}) {
    return (
        <div key={name} className={`${className} space-y-1`}>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-800"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-[#4977ec] focus:border-[#4977ec] placeholder:text-sm`}
                    placeholder={placeholder}
                    {...props}
                    required={required}
                />
            ) : type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    onChange={onchange}
                    className={`block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 outline-none focus:ring-[#4977ec] focus:border-[#4977ec] bg-white`}
                    required={required}
                    {...props}
                >
                    {options.map((option, i) => (
                        <option key={i} value={option} disabled={i === 0}>
                            {option}
                        </option>
                    ))}
                </select>
            ) : (
                <div className="relative">
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={`block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#4977ec] focus:border-[#4977ec] outline-none placeholder:text-sm`}
                        placeholder={placeholder}
                        required={required}
                        {...props}
                    />
                </div>
            )}
            {errors?.[name] && (
                <p className="text-sm text-red-600 animate-pulse">
                    {errors[name]}
                </p>
            )}
        </div>
    );
}
