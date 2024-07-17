import Dropdown from "../Dropdown";
import Input from "../Input";
import {
    filterStatus,
    filterAttribute,
    filterOperation,
} from "../../services/api";
import { useState } from "react";

const FilterConversation = ({ closeModal }) => {
    const [status, setStatus] = useState("");
    const [attribute, setAttribute] = useState("");
    const [operation, setOperation] = useState("");
    const [filteredInput, setFilteredInput] = useState("");

    const handleStatusChange = (e) => setStatus(e.target.value.toLowerCase());
    const handleAttributeChange = (e) =>
        setAttribute(e.target.value.toLowerCase());
    const handleOperationChange = (e) =>
        setOperation(e.target.value.toLowerCase());
    const handleInputValue = (e) =>
        setFilteredInput(e.target.value.toLowerCase());

    const applyFilters = async () => {
        const searchParams = {
            action: status,
            attribute: attribute,
            contain: operation,
            value: filteredInput,
        };
        closeModal();

        // try {
        //     const response = await searchFilteredData(searchParams);
        //     console.log("Filtered data:", response.data);
        //     closeModal();
        // } catch (error) {
        //     console.error("Failed to fetch filtered data:", error);
        // }
    };

    return (
        <div>
            <h3 className="font-bold border-b pb-4 mb-4">
                Filter Conversation
            </h3>
            <div className="flex flex-col lg:flex-row gap-4">
                <Dropdown
                    options={filterStatus}
                    value={status}
                    onChange={handleStatusChange}
                    placeholder="Status"
                    className="basis-1/4"
                />
                <Dropdown
                    options={filterAttribute}
                    value={attribute}
                    onChange={handleAttributeChange}
                    placeholder="Attribute"
                    className="basis-1/4"
                />
                <Dropdown
                    options={filterOperation}
                    value={operation}
                    onChange={handleOperationChange}
                    placeholder="Operation"
                    className="basis-1/4"
                />
                <Input
                    value={filteredInput}
                    onChange={handleInputValue}
                    type="text"
                    placeholder="Value"
                    className="basis-1/4"
                />
            </div>

            <button
                onClick={applyFilters}
                className="border px-10 py-2 rounded bg-green-500 text-white absolute bottom-8 right-8"
            >
                Apply
            </button>
        </div>
    );
};

export default FilterConversation;
