import { useEffect, useState } from "react";

import Button from "@mui/material/Button"; // Material UI Button

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const QuestionModal = ({
  selectedNode,
  setSelectedNode,
  closeModal,
  onSave,
}) => {
  const [answerVariant, setAnswerVariant] = useState("");
  const [answerOptions, setAnswerOptions] = useState([]); // State to store answer variants
  const [errorMessage, setErrorMessage] = useState("");

  // Function to add answer variant
  const handleAddAnswer = () => {
    if (answerVariant.trim()) {
      // Check if the answer already exists
      if (answerOptions.includes(answerVariant.trim())) {
        setErrorMessage("This answer already exists.");
      } else {
        setAnswerOptions([...answerOptions, answerVariant.trim()]);
        setAnswerVariant(""); // Clear input
        setErrorMessage(""); // Clear error
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddAnswer();
    }
  };

  const handleEditAnswer = (index, value) => {
    const updatedOptions = [...answerOptions];
    updatedOptions[index] = value;
    setAnswerOptions(updatedOptions);
  };

  // Function to delete an answer variant
  const handleDeleteAnswer = (index) => {
    const updatedOptions = answerOptions.filter((_, i) => i !== index);
    setAnswerOptions(updatedOptions);
  };

  // Function to save the data to the node and close the modal
  const handleSave = () => {
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: selectedNode?.data?.label || "Question",
        answerOptions: answerOptions,
      },
    };

    onSave(updatedNode);
    closeModal(); // Close the modal after saving
  };

  const handleAnswerVariantChange = (e) => {
    const value = e.target.value.trim();
    setAnswerVariant(e.target.value);

    // Check if the value already exists in the answer options
    if (answerOptions.includes(value)) {
      setErrorMessage("This answer already exists.");
    } else {
      setErrorMessage(""); // Clear error if the value doesn't exist
    }
  };

  useEffect(() => {
    if (selectedNode?.data?.answerOptions) {
      setAnswerOptions(selectedNode.data.answerOptions);
    }
  }, [selectedNode]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold border-b pb-2">Set a question</h2>

      <div className="py-4 flex flex-col gap-3 overflow-auto scrollbar-hide text-sm">
        {/* Question Text */}
        <div>
          <label className="block font-medium mb-2">Question text</label>

          <textarea
            className="w-full p-2 rounded-lg resize-none bg-slate-50 outline-none scrollbar-hide"
            rows="3"
            placeholder="Type your question here"
            value={selectedNode?.data?.label || ""}
            onChange={(e) =>
              setSelectedNode((prevNode) => ({
                ...prevNode,
                data: { ...prevNode.data, label: e.target.value },
              }))
            }
          />
        </div>

        {/* Answer Options Display */}
        {answerOptions.length > 0 && (
          <div>
            <label className="block font-medium mb-2">
              Answer Options
            </label>

            {answerOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded bg-slate-50 outline-none"
                  value={option}
                  onChange={(e) => handleEditAnswer(index, e.target.value)}
                />

                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={() => handleDeleteAnswer(index)}
                  className=" text-red-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}

        {/* Add Answer Variant */}
        <div>
          <label className="block font-medium mb-2">
            Add answer variant
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 p-2 outline-none bg-slate-50 rounded"
              placeholder="Type answer variant here"
              value={answerVariant}
              onChange={handleAnswerVariantChange}
              onKeyDown={handleKeyDown}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAnswer}
              disabled={!answerVariant.trim() || errorMessage !== ""}
            >
              Create
            </Button>
          </div>
          {errorMessage && <p className="text-red-500 mt-1">{errorMessage}</p>}
        </div>

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

export default QuestionModal;
