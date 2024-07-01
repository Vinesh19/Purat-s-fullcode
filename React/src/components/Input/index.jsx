import classNames from "classnames";

const Input = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    className = "",
    errorMessage,
    ...props
}) => {
    return (
        <div className={classNames("flex flex-col font-medium", className)}>
            {label && <label>{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`rounded-md px-2 py-1.5 mt-1 border outline-none font-normal ${
                    disabled ? "cursor-not-allowed" : ""
                }`}
                {...props}
            />
            {errorMessage && (
                <span className="text-red-500 text-sm mt-1">
                    {errorMessage}
                </span>
            )}
        </div>
    );
};

export default Input;
