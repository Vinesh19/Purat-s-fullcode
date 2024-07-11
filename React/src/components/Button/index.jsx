import PropTypes from "prop-types";
import classNames from "classnames";

// Define possible variants and sizes as constants
const VARIANTS = {
    DEFAULT: "default",
    PRIMARY: "primary",
    SECONDARY: "secondary",
};

const SIZES = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
};

const Button = ({
    children,
    onClick = () => {}, // Default function that does nothing
    className = "",
    variant = VARIANTS.DEFAULT,
    size = SIZES.MEDIUM,
    disabled = false,
    ...props
}) => {
    const baseStyles =
        "border rounded px-6 py-2 transition duration-150 ease-in-out";

    const variantStyles = {
        [VARIANTS.DEFAULT]: "border-gray-500 text-gray-500",
        [VARIANTS.PRIMARY]: "border-green-500 bg-green-500 text-white",
        [VARIANTS.SECONDARY]: "border-green-500 text-green-500",
    };

    const sizeStyles = {
        [SIZES.SMALL]: "text-sm py-1 px-3",
        [SIZES.MEDIUM]: "text-base py-2 px-6",
        [SIZES.LARGE]: "text-lg py-3 px-8",
    };

    const disabledStyles = disabled ? "cursor-not-allowed opacity-50" : "";

    return (
        <button
            className={classNames(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                disabledStyles,
                className
            )}
            onClick={!disabled ? onClick : null}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

// Update PropTypes to reflect the expected types
Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    variant: PropTypes.oneOf(Object.values(VARIANTS)),
    size: PropTypes.oneOf(Object.values(SIZES)),
    disabled: PropTypes.bool,
};

export default Button;
