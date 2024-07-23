import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Dropdown from "../../Dropdown";
import Input from "../../Input";
import Button from "../../Button";
import MultiSelectDropdown from "../../MultiSelectDropdown";

import { advanceFilterChatData } from "../../../services/api";
import {
    FILTER_STATUS,
    FILTER_ATTRIBUTE,
    FILTER_OPERATION,
    FILTER_OPTIONS,
} from "../../../services/constant";

const AdvanceFilter = ({ closeModal, user }) => {
    const [filters, setFilters] = useState([
        { id: Date.now(), attribute: "", operation: "", value: "" },
    ]);

    const [selectedAttributes, setSelectedAttributes] = useState({});

    const handleFilterChange = (id, field, value) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id ? { ...filter, [field]: value } : filter
            )
        );
    };

    const handleAttributeChange = (id, value) => {
        setSelectedAttributes((prev) => ({ ...prev, [id]: value }));
        handleFilterChange(id, "attribute", "Attribute");
    };

    const addNewFilter = () => {
        setFilters((prevFilters) => [
            ...prevFilters,
            { id: Date.now(), attribute: "", operation: "", value: "" },
        ]);
    };

    const removeFilter = (id) => {
        setFilters((prevFilters) =>
            prevFilters.filter((filter) => filter.id !== id)
        );
        setSelectedAttributes((prev) => {
            const newSelectedAttributes = { ...prev };
            delete newSelectedAttributes[id];
            return newSelectedAttributes;
        });
    };

    const applyFilters = async () => {
        const searchParams = filters.map(
            ({ attribute, operation, value, id }) => {
                if (attribute === "Attribute") {
                    const selectedAttribute = selectedAttributes[id];
                    return {
                        action: "attribute",
                        attribute: selectedAttribute || "",
                        value: value,
                        contain: operation,
                        username: user.username,
                    };
                } else if (attribute === "Status") {
                    return {
                        action: "status",
                        username: user.username,
                        filter: value,
                    };
                } else if (attribute === "Assignee") {
                    return {
                        action: "assignee",
                        username: user.username,
                        agent_id: value,
                    };
                } else {
                    return {
                        action: attribute.toLowerCase(),
                        username: user.username,
                        value: value,
                        contain: operation,
                    };
                }
            }
        );

        try {
            const response = await advanceFilterChatData(searchParams);
            console.log("Filtered data:", searchParams);
            closeModal();
        } catch (error) {
            console.error("Failed to fetch filtered data:", error);
        }
    };

    const renderFilterFields = (filter) => {
        switch (filter.attribute) {
            case "Status":
            case "Assignee":
                return (
                    <MultiSelectDropdown
                        options={FILTER_OPTIONS}
                        value={filter.value}
                        onChange={(selectedValues) =>
                            handleFilterChange(
                                filter.id,
                                "value",
                                selectedValues
                            )
                        }
                    />
                );
            default:
                return (
                    <>
                        <Dropdown
                            options={FILTER_ATTRIBUTE.map((attr) => ({
                                id: attr.id,
                                name: attr.name,
                            }))}
                            value={selectedAttributes[filter.id] || ""}
                            onChange={(e) =>
                                handleAttributeChange(filter.id, e.target.value)
                            }
                            placeholder="Attribute"
                            className="basis-1/4"
                        />
                        <Dropdown
                            options={FILTER_OPERATION}
                            value={filter.operation}
                            onChange={(e) =>
                                handleFilterChange(
                                    filter.id,
                                    "operation",
                                    e.target.value
                                )
                            }
                            placeholder="Operation"
                            className="basis-1/4"
                        />

                        <Input
                            value={filter.value}
                            onChange={(e) =>
                                handleFilterChange(
                                    filter.id,
                                    "value",
                                    e.target.value
                                )
                            }
                            type="text"
                            placeholder="Value"
                            className="basis-1/4"
                        />
                    </>
                );
        }
    };

    return (
        <div>
            <h3 className="font-bold border-b pb-4 mb-4">
                Filter Conversation
            </h3>

            {filters.map((filter) => (
                <div
                    key={filter.id}
                    className="flex flex-col lg:flex-row items-center gap-4 mb-4"
                >
                    <Dropdown
                        options={FILTER_STATUS.map((status) => ({
                            id: status.id,
                            name: status.name,
                        }))}
                        value={filter.attribute}
                        onChange={(e) =>
                            handleFilterChange(
                                filter.id,
                                "attribute",
                                e.target.value
                            )
                        }
                        placeholder="Status"
                        className="basis-1/4"
                    />

                    {renderFilterFields(filter)}

                    <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={() => removeFilter(filter.id)}
                        className="text-red-500 cursor-pointer"
                    />
                </div>
            ))}

            <Button variant="primary" onClick={addNewFilter}>
                Add new Segment +
            </Button>

            <Button
                variant="primary"
                onClick={applyFilters}
                className="absolute bottom-8 right-8"
            >
                Apply
            </Button>
        </div>
    );
};

export default AdvanceFilter;
