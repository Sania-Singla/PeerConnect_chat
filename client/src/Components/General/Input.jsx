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
                    className={`mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-sm`}
                    placeholder={placeholder}
                    {...props}
                    required={required}
                />
            ) : type === 'select' ? (
                <select
                    id={name}
                    name={name}
                    onChange={onchange}
                    className={`mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200`}
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
                        className={`mt-1 block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none placeholder:text-sm`}
                        placeholder={placeholder}
                        required={required}
                        {...props}
                    />
                </div>
            )}
            {errors?.[name] && (
                <p className="text-sm text-red-600 mt-1 animate-pulse">
                    {errors[name]}
                </p>
            )}
        </div>
    );
}
