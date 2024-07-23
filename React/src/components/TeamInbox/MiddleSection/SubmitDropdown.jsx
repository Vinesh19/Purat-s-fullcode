import { useState, useRef, useEffect } from "react";
import classNames from "classnames";

const SubmitDropdown = ({
    options,
    value,
    onChange,
    placeholder,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={classNames("relative", className)}
            ref={dropdownRef}
            style={{ width: "132px" }}
        >
            <button
                className="w-full rounded-md px-4 py-1.5 font-semibold bg-slate-50 text-slate-400 text-left"
                onClick={handleButtonClick}
            >
                {value ? value.name : placeholder}
                <span className="float-right">&#x25BC;</span>{" "}
                {/* Down arrow */}
            </button>
            {isOpen && (
                <div className="absolute mt-1 w-full border rounded-md bg-white shadow-lg z-10">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-200 font-semibold"
                            onClick={() => handleOptionClick(option)}
                        >
                            <span
                                className="mr-2"
                                style={{ color: option.color }}
                            >
                                &#x25CF;
                            </span>
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubmitDropdown;
