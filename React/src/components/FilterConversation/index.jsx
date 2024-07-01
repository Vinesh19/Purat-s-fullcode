import Dropdown from "../Dropdown";
import Input from "../Input";

import {
    filterStatus,
    filterAttribute,
    filterOperation,
} from "../../services/api";
import { useState } from "react";

const FilterConversation = () => {
    const [status, setStatus] = useState("");
    const [attribute, setAttribute] = useState("");
    const [Operation, setOperation] = useState("");
    const [filteredInput, setFilteredInput] = useState("");

    const handleStatusChange = (e) => setStatus(e.target.value);
    const handleAttributeChange = (e) => setAttribute(e.target.value);
    const handleOperationChange = (e) => setOperation(e.target.value);
    const handleInputValue = (e) => setFilteredInput(e.target.value);
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
                    placeholder="status"
                    className=" basis-1/4"
                />
                <Dropdown
                    options={filterAttribute}
                    value={attribute}
                    onChange={handleAttributeChange}
                    placeholder="Attribute"
                    className=" basis-1/4"
                />
                <Dropdown
                    options={filterOperation}
                    value={Operation}
                    onChange={handleOperationChange}
                    placeholder="Operation"
                    className=" basis-1/4"
                />
                <Input
                    value={filteredInput}
                    onChange={handleInputValue}
                    type="text"
                    placeholder="Value"
                    className=" basis-1/4"
                />
            </div>

            <button
                type="submit"
                className="border px-10 py-2 rounded bg-green-500 text-white absolute bottom-8 right-8"
            >
                Apply
            </button>
        </div>
    );
};

export default FilterConversation;
