import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Button";

const CustomParameter = ({ onSave, params }) => {
    const [attributes, setAttributes] = useState(params);

    const handleAddAttribute = () => {
        setAttributes([...attributes, { key: "", value: "" }]);
    };

    const handleChange = (index, field, value) => {
        const newAttributes = attributes.map((attr, i) => {
            if (i === index) {
                return { ...attr, [field]: value };
            }
            return attr;
        });
        setAttributes(newAttributes);
    };

    const handleDelete = (index) => {
        const newAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(newAttributes);
    };

    const handleSave = () => {
        onSave(attributes);
    };

    return (
        <div className="py-1 h-full flex flex-col">
            <div className="border-b pb-4">
                <h3 className="font-bold">Contact Attributes</h3>
            </div>

            <div className="flex justify-around items-center my-4">
                <div className="font-semibold">Custom Attribute</div>
                <div className="font-semibold">Value</div>
                <div></div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto mb-16 scrollbar-hide">
                {attributes.map((attr, index) => (
                    <div
                        key={index}
                        className="flex justify-between gap-6 items-center"
                    >
                        <input
                            type="text"
                            placeholder="Custom Attribute"
                            value={attr.key}
                            onChange={(e) =>
                                handleChange(index, "key", e.target.value)
                            }
                            className="border p-2 rounded w-full"
                        />

                        <input
                            type="text"
                            placeholder="Value"
                            value={attr.value}
                            onChange={(e) =>
                                handleChange(index, "value", e.target.value)
                            }
                            className="border p-2 rounded w-full"
                        />

                        <FontAwesomeIcon
                            icon={faTrashCan}
                            className="cursor-pointer text-red-500"
                            onClick={() => handleDelete(index)}
                        />
                    </div>
                ))}

                <Button
                    variant="secondary"
                    onClick={handleAddAttribute}
                    className="w-fit"
                >
                    Add new attribute+
                </Button>
            </div>

            <Button
                variant="primary"
                onClick={handleSave}
                className="absolute bottom-4 right-4"
            >
                Save
            </Button>
        </div>
    );
};

export default CustomParameter;
