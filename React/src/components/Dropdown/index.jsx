import classNames from "classnames";

const Dropdown = ({
    options,
    value,
    onChange,
    placeholder,
    className,
    valueKey = "name",
}) => {
    return (
        <select
            className={classNames(
                "w-full border rounded-md px-2 py-1.5 mt-1 outline-none",
                className,
                { "text-gray-400": !value }
            )}
            value={value}
            onChange={onChange}
        >
            {placeholder && (
                <option value="" disabled hidden>
                    {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option.id} value={option[valueKey]}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
