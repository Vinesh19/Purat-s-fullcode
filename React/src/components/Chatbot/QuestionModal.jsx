import { useState } from "react";
import Button from "@mui/material/Button"; // Material UI Button
import DeleteIcon from "@mui/icons-material/Delete"; // Material UI Delete Icon
import IconButton from "@mui/material/IconButton"; // Material UI IconButton

const QuestionModal = ({ selectedNode, setSelectedNode, closeModal }) => {
  const [answerVariant, setAnswerVariant] = useState("");
  const [answerOptions, setAnswerOptions] = useState([]); // State to store answer variants

  // Function to add answer variant
  const handleAddAnswerVariant = () => {
    if (answerVariant.trim()) {
      setAnswerOptions([...answerOptions, answerVariant]);
      setAnswerVariant(""); // Clear the input
    }
  };

  // Function to delete an answer variant
  const handleDeleteAnswer = (index) => {
    const updatedOptions = answerOptions.filter((_, i) => i !== index);
    setAnswerOptions(updatedOptions);
  };

  return (
    <div>
      <h2 className="text-xl font-bold border-b pb-2">Set a question</h2>

      <div className="my-4 flex flex-col gap-3">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Question text
          </label>

          <textarea
            className="w-full p-4 rounded-lg resize-none bg-slate-50 outline-none scrollbar-hide"
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
            <label className="block text-sm font-semibold mb-1">
              Answer Options
            </label>
            {answerOptions.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  className="flex-1 p-2 rounded bg-slate-50 outline-none"
                  value={option}
                  readOnly
                />
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteAnswer(index)}
                >
                  <DeleteIcon className="text-red-500" />
                </IconButton>
              </div>
            ))}
          </div>
        )}

        {/* Add Answer Variant */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Add answer variant
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 p-2 outline-none bg-slate-50 rounded"
              placeholder="Type answer variant here"
              value={answerVariant}
              onChange={(e) => setAnswerVariant(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAnswerVariant}
              disabled={!answerVariant.trim()}
            >
              Create
            </Button>
          </div>
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outlined" color="secondary" onClick={closeModal}>
            Cancel
          </Button>

          <Button variant="contained" color="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
