import Select from "react-select";

const colorStyles = {
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: data.color,
            padding: "0 4px", 
            borderRadius: "16px",
        };
    },

    multiValueLabel: (styles) => ({
        ...styles,
        color: "white",
        fontWeight: "bold",
        fontSize: "12px", 
    }),

    multiValueRemove: (styles) => ({
        ...styles,
        color: "white",
        ":hover": {
            backgroundColor: "transparent",
            color: "white",
        },
    }),

    control: (styles) => ({
        ...styles,
        boxShadow: "none", 
    }),
};

const MultiSelectDropdown = ({ options, value, onChange, placeholder }) => {
    const selectOptions = options.map((option) => ({
        value: option.name,
        label: option.name,
        color: option.color,
    }));

    const handleChange = (selectedOptions) => {
        const values = selectedOptions
            ? selectedOptions.map((option) => option.value)
            : [];
        onChange(values);
    };

    return (
        <Select
            options={selectOptions}
            value={selectOptions.filter((option) =>
                value.includes(option.value)
            )}
            onChange={handleChange}
            placeholder={placeholder}
            isMulti
            styles={colorStyles}
            className="w-[90%]"
        />
    );
};

export default MultiSelectDropdown;
