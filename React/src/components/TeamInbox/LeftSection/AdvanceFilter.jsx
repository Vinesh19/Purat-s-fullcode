import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Dropdown from "../../Dropdown";
import Input from "../../Input";
import Button from "../../Button";

import { advanceFilterChatData, fetchAgentsName } from "../../../services/api";
import {
  FILTER_STATUS,
  FILTER_ATTRIBUTE,
  FILTER_OPERATION,
  FILTER_OPTIONS,
} from "../../../services/constant";

const AdvanceFilter = ({ closeModal, user, onFilterApply }) => {
  const [filters, setFilters] = useState([
    { id: Date.now(), attribute: "", operation: "", value: "" },
  ]);

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Fetch agent names from the API
  const fetchAgents = async () => {
    try {
      const payload = {
        action: "read",
        username: user.username,
      };
      const response = await fetchAgentsName(payload);
      const transformedAgents = response?.data?.data.map((agent) => ({
        id: agent.id,
        name: agent.assign_user,
      }));
      setAgents(transformedAgents);
    } catch (error) {
      console.error("Failed to fetch agents", error);
    }
  };

  // Handle agent selection
  const handleAgentChange = (e) => {
    const selectedAgentName = e.target.value; // Get the selected agent's name
    const agent = agents.find((agent) => agent.name === selectedAgentName); // Find the full agent object based on name
    setSelectedAgent(agent); // Store the full agent object
  };

  // Handle filter changes
  const handleFilterChange = (id, field, value) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === id
          ? {
              ...filter,
              [field]: value,
              // Clear value and operation if the attribute changes
              ...(field === "attribute" ? { value: "", operation: "" } : {}),
            }
          : filter
      )
    );
  };

  // Handle attribute change
  const handleAttributeChange = (id, value) => {
    const selectedAttribute = FILTER_ATTRIBUTE.find(
      (attr) => attr.name === value
    ); // Match based on name
    setSelectedAttributes((prev) => ({
      ...prev,
      [id]: selectedAttribute.name,
    })); // Store the name
    handleFilterChange(id, "attribute", selectedAttribute.name); // Set the actual attribute value
  };

  // Remove filter
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

  // Clear all fields
  const clearFields = () => {
    setFilters([{ id: Date.now(), attribute: "", operation: "", value: "" }]);
    setSelectedAttributes({});
    setSelectedAgent(null);
  };

  // Apply filters and send the payload
  const applyFilters = async () => {
    if (filters.length === 0) return;

    const firstFilter = filters[0];
    const status = firstFilter.attribute.toLowerCase();

    let searchParams = {};

    if (status === "status") {
      searchParams = {
        action: "status",
        username: user.username,
        value: firstFilter.value.toLowerCase(),
      };
    } else if (status === "assignee") {
      if (!selectedAgent?.id) {
        toast.error("Please select a valid agent");
        return;
      }
      searchParams = {
        action: "assignee",
        username: user.username,
        agent: selectedAgent.id,
      };
    }
    // Handle the case for attributes
    else if (
      FILTER_ATTRIBUTE.some(
        (attr) =>
          attr.name.toLowerCase() === firstFilter.attribute.toLowerCase()
      )
    ) {
      const selectedAttribute =
        selectedAttributes[firstFilter.id].toLowerCase();
      searchParams = {
        action: "attribute", // Action remains "attribute"
        attribute: selectedAttribute || "", // Send the actual attribute here
        value: firstFilter.value,
        contain: firstFilter.operation,
        username: user.username,
      };
    }
    // Fallback for other attributes
    else {
      searchParams = {
        action: status,
        username: user.username,
        value: firstFilter.value,
        contain: firstFilter.operation,
      };
    }

    try {
      const response = await advanceFilterChatData(searchParams); // Send the single filter params

      if (response?.data?.stats === 0 && response?.data?.message) {
        toast.error(response.data.message); // Show the backend message in a toast
      } else {
        onFilterApply(response?.data || {}); // Apply the filtered data
        toast.success("Filters applied successfully");
        clearFields();
        closeModal();
      }

      toast.success("Filters applied successfully");
      clearFields();
      closeModal();
    } catch (error) {
      // Handle the error response here
      if (error.response?.data?.message) {
        toast.error(error.response.data.message); // Show backend message from error response
        clearFields();
        closeModal();
      } else {
        toast.error("Failed to apply filters"); // Fallback for other errors
      }
      console.error("Failed to fetch filtered data:", error);
    }
  };

  // Render filter fields based on the selected attribute
  const renderFilterFields = (filter) => {
    switch (filter.attribute) {
      case "Status":
        return (
          <Dropdown
            options={FILTER_OPTIONS}
            value={filter.value} // Use the status value directly
            onChange={
              (e) => handleFilterChange(filter.id, "value", e.target.value) // Pass single status value
            }
            placeholder="Select Status"
          />
        );
      case "Assignee":
        return (
          <Dropdown
            options={agents}
            value={selectedAgent?.name || ""} // Set value based on agent's name
            onChange={handleAgentChange}
            placeholder="Select Agent"
          />
        );
      default:
        return (
          <>
            <Dropdown
              options={FILTER_ATTRIBUTE}
              value={selectedAttributes[filter.id] || ""}
              onChange={(e) => handleAttributeChange(filter.id, e.target.value)}
              placeholder="Attribute"
              className="basis-1/4"
            />
            <Dropdown
              options={FILTER_OPERATION}
              value={filter.operation}
              onChange={(e) =>
                handleFilterChange(filter.id, "operation", e.target.value)
              }
              placeholder="Operation"
              className="basis-1/4"
            />
            <Input
              value={filter.value}
              onChange={(e) =>
                handleFilterChange(filter.id, "value", e.target.value)
              }
              type="text"
              placeholder="Value"
              className="basis-1/4"
            />
          </>
        );
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [user.username]);

  return (
    <div>
      <h3 className="font-bold border-b pb-4 mb-4">Filter Conversation</h3>

      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex flex-col lg:flex-row items-center gap-4 mb-4"
        >
          <Dropdown
            options={FILTER_STATUS}
            value={filter.attribute}
            onChange={(e) =>
              handleFilterChange(filter.id, "attribute", e.target.value)
            }
            placeholder="Attributes"
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
