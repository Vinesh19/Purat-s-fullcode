import { useEffect, useState } from "react";

import Button from "@mui/material/Button"; // Material UI Button

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const ButtonsModal = ({
  selectedNode,
  setSelectedNode,
  closeModal,
  onSave,
}) => {
  const [buttonText, setButtonText] = useState("");
  const [buttons, setButtons] = useState([]); // State to store buttons
  const [errorMessage, setErrorMessage] = useState("");

  // Function to add a button
  const handleAddButton = () => {
    if (buttonText.trim()) {
      // Check if the button already exists
      if (buttons.includes(buttonText.trim())) {
        setErrorMessage("This button already exists.");
      } else if (buttonText.trim().length > 20) {
        setErrorMessage("Button text cannot exceed 20 characters.");
      } else {
        setButtons([...buttons, buttonText.trim()]);
        setButtonText(""); // Clear input
        setErrorMessage(""); // Clear error
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddButton();
    }
  };

  const handleEditButton = (index, value) => {
    const updatedButtons = [...buttons];
    updatedButtons[index] = value;
    setButtons(updatedButtons);
  };

  // Function to delete a button
  const handleDeleteButton = (index) => {
    const updatedButtons = buttons.filter((_, i) => i !== index);
    setButtons(updatedButtons);
  };

  // Function to save the data to the node and close the modal
  const handleSave = () => {
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        bodyText: selectedNode?.data?.bodyText || "Body Text",
        buttons: buttons,
      },
    };

    onSave(updatedNode);
    closeModal(); // Close the modal after saving
  };

  const handleButtonTextChange = (e) => {
    const value = e.target.value.trim();
    setButtonText(e.target.value);

    // Check if the value already exists in the button options
    if (buttons.includes(value)) {
      setErrorMessage("This button already exists.");
    } else if (value.length > 20) {
      setErrorMessage("Button text cannot exceed 20 characters.");
    } else {
      setErrorMessage(""); // Clear error if the value doesn't exist
    }
  };

  useEffect(() => {
    if (selectedNode?.data?.buttons) {
      setButtons(selectedNode.data.buttons);
    }
  }, [selectedNode]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold border-b pb-2">Set Buttons</h2>

      <div className="py-4 flex flex-col gap-3 overflow-auto scrollbar-hide text-sm ">
        {/* Body Text */}
        <div>
          <label className="block font-medium mb-2">Body Text</label>

          <textarea
            className="w-full p-2 rounded-lg resize-none bg-slate-50 outline-none scrollbar-hide"
            rows="3"
            placeholder="Type your body text here"
            value={selectedNode?.data?.bodyText || ""}
            onChange={(e) =>
              setSelectedNode((prevNode) => ({
                ...prevNode,
                data: { ...prevNode.data, bodyText: e.target.value },
              }))
            }
          />
        </div>

        {/* Button Options Display */}
        {buttons.length > 0 && (
          <div>
            {buttons.map((button, index) => (
              <div key={index} className="flex flex-col gap-1 mb-3">
                <label className="block text-gray-600">
                  <span className="font-semibold">{`Button ${index + 1}`}</span>{" "}
                  <span>(max 20 chars)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded bg-slate-50 outline-none"
                    value={button}
                    maxLength={20}
                    onChange={(e) => handleEditButton(index, e.target.value)}
                  />

                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => handleDeleteButton(index)}
                    className="text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Button Input */}
        {buttons.length < 3 && (
          <div>
            <label className="block font-medium mb-2">New Button</label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-2 outline-none bg-slate-50 rounded"
                placeholder="Type button text here"
                value={buttonText}
                onChange={handleButtonTextChange}
                onKeyDown={handleKeyDown}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddButton}
                disabled={!buttonText.trim() || errorMessage !== ""}
              >
                Create
              </Button>
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-1">{errorMessage}</p>
            )}
          </div>
        )}

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outlined" color="secondary" onClick={closeModal}>
            Cancel
          </Button>

          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonsModal;
