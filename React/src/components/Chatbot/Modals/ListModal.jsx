import { useEffect, useState, useRef } from "react";

import Button from "@mui/material/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const ListModal = ({ selectedNode, setSelectedNode, closeModal, onSave }) => {
  const [bodyText, setBodyText] = useState(""); // For the Body Text field
  const [sections, setSections] = useState([]); // For the list sections
  const [rowTexts, setRowTexts] = useState({}); // To track new row text inputs for each section
  const [errorMessage, setErrorMessage] = useState({});
  const [showRowInput, setShowRowInput] = useState({}); // Track which section is adding a new row
  const inputRefs = useRef({});

  // Add new section
  const handleAddSection = () => {
    let hasErrors = false;
    const errors = {};

    // Check for empty section title if there are multiple sections
    sections.forEach((section, index) => {
      if (section.title.trim() === "") {
        errors[`sectionTitle_${index}`] =
          "If you want to add more than one section, you should fill out section title.";
        hasErrors = true;
      }
    });

    // Check for empty rows
    sections.forEach((section, sectionIndex) => {
      section.rows.forEach((row, rowIndex) => {
        if (row.trim() === "") {
          errors[`rowError_${sectionIndex}_${rowIndex}`] =
            "Row title can not be empty.";
          hasErrors = true;
        }
      });
    });

    if (hasErrors) {
      setErrorMessage(errors);
      return;
    }

    if (sections.length >= 10) {
      setErrorMessage({ general: "Maximum of 10 sections allowed." });
      return;
    }

    setSections([...sections, { title: "", rows: ["default row"] }]);
    setErrorMessage({});
  };

  // Add new row to a section
  const handleAddRow = (sectionIndex) => {
    const newRowText = rowTexts[sectionIndex]?.trim() || "";
    if (newRowText === "") {
      setErrorMessage({ ...errorMessage, row: "Row title can not be empty." });
      return;
    }

    const updatedSections = [...sections];
    if (updatedSections[sectionIndex].rows.length >= 5) {
      setErrorMessage({ general: "Maximum of 5 rows per section allowed." });
      return;
    }

    updatedSections[sectionIndex].rows.push(newRowText);
    setSections(updatedSections);
    setRowTexts({ ...rowTexts, [sectionIndex]: "" }); // Reset row input
    setShowRowInput({ ...showRowInput, [sectionIndex]: false }); // Hide row input after adding
    setErrorMessage({}); // Clear errors
  };

  // Remove a row from a section
  const handleDeleteRow = (sectionIndex, rowIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].rows.splice(rowIndex, 1); // Remove the row
    setSections(updatedSections);
  };

  // Remove a section
  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e, sectionIndex) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddRow(sectionIndex);
    }
  };

  // Save node
  const handleSave = () => {
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        bodyText: bodyText,
        sections,
      },
    };
    onSave(updatedNode);
    closeModal();
  };

  useEffect(() => {
    if (selectedNode?.data?.sections) {
      setSections(selectedNode.data.sections);
    }
    if (selectedNode?.data?.bodyText) {
      setBodyText(selectedNode.data.bodyText);
    }
  }, [selectedNode]);

  useEffect(() => {
    Object.keys(showRowInput).forEach((key) => {
      if (showRowInput[key] && inputRefs.current[key]) {
        inputRefs.current[key].focus();
      }
    });
  }, [showRowInput]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold border-b pb-2">Set List Sections</h2>

      {/* Body Text */}
      <div className="overflow-auto scrollbar-hide text-sm">
        <label className="block font-medium my-2">Body Text</label>

        <textarea
          className="w-full p-2 rounded-lg resize-none bg-slate-50 outline-none scrollbar-hide"
          rows="3"
          placeholder="Type the body text here"
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
        />

        <div className="py-4 flex flex-col gap-4">
          {/* Section Loop */}
          {sections.map((section, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <label className="block font-medium mb-2">
                {`Section ${index + 1} Title`}{" "}
                <span className="text-sm font-normal text-gray-500">
                  (required, max 24 chars)
                </span>
              </label>

              <input
                type="text"
                className="w-full mb-4 px-4 py-2 rounded outline-none"
                value={section.title}
                maxLength={24}
                onChange={(e) => {
                  const updatedSections = [...sections];
                  updatedSections[index].title = e.target.value;
                  setSections(updatedSections);
                  setErrorMessage((prev) => ({
                    ...prev,
                    [`sectionTitle_${index}`]: "", // Clear the error as user types
                  }));
                }}
              />

              {errorMessage[`sectionTitle_${index}`] && (
                <p className="text-red-500 text-xs mb-2 -mt-2">
                  {errorMessage[`sectionTitle_${index}`]}
                </p>
              )}

              {/* Rows Loop */}
              {section.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-2">
                  <div className="flex gap-2">
                    {/* Input Field */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">
                        {`Row ${rowIndex + 1}`}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          (required, max 24 chars)
                        </span>
                      </label>

                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded outline-none"
                        value={row}
                        maxLength={24}
                        onChange={(e) => {
                          const updatedSections = [...sections];
                          updatedSections[index].rows[rowIndex] =
                            e.target.value;
                          setSections(updatedSections);
                          setErrorMessage((prev) => ({
                            ...prev,
                            [`rowError_${index}_${rowIndex}`]: "", // Clear the row error on typing
                          }));
                        }}
                      />
                    </div>

                    {/* Delete Icon */}
                    {section.rows.length > 1 && (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={() => handleDeleteRow(index, rowIndex)}
                        className="text-red-500 cursor-pointer self-end mb-2"
                      />
                    )}
                  </div>

                  {/* Error Message */}
                  {errorMessage[`rowError_${index}_${rowIndex}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorMessage[`rowError_${index}_${rowIndex}`]}
                    </p>
                  )}
                </div>
              ))}

              {/* Add New Row Input and Button */}
              {showRowInput[index] ? (
                <div className="flex items-center gap-2 my-4">
                  <input
                    type="text"
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="flex-1 p-2 outline-none rounded"
                    placeholder="New row text"
                    value={rowTexts[index] || ""}
                    maxLength={24}
                    onChange={(e) =>
                      setRowTexts({ ...rowTexts, [index]: e.target.value })
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddRow(index)}
                    disabled={!rowTexts[index]?.trim()}
                  >
                    Create
                  </Button>
                </div>
              ) : (
                section.rows.length < 5 && ( // Hide if 5 rows exist
                  <p
                    className="text-blue-500 underline cursor-pointer my-2"
                    onClick={() =>
                      setShowRowInput({ ...showRowInput, [index]: true })
                    }
                  >
                    New Row
                  </p>
                )
              )}

              {/* Remove Section Button */}
              <Button
                onClick={() => handleRemoveSection(index)}
                variant="outlined"
                color="error"
                fullWidth
                className="!my-2"
              >
                Remove Section
              </Button>
            </div>
          ))}

          {/* Add New Section Button */}
          <Button
            onClick={handleAddSection}
            variant="outlined"
            color="primary"
            fullWidth
            className="mt-4"
          >
            Add New Section
          </Button>

          {errorMessage.general && (
            <p className="text-red-500 mt-2">{errorMessage.general}</p>
          )}

          {/* Save & Cancel */}
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
    </div>
  );
};

export default ListModal;
