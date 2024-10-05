import { useState, useCallback, useRef, useEffect } from "react";

import { Handle, useReactFlow } from "reactflow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const QuestionNode = ({ id, data }) => {
  const { setNodes, getNode, getNodes } = useReactFlow(); // Similar to MessageNode's setup

  const [isMenuOpen, setIsMenuOpen] = useState(false); // To toggle menu

  const menuRef = useRef(null); // Ref for the menu
  const buttonRef = useRef(null); // Ref for the toggle button
  const reactFlowWrapper = document.querySelector(".react-flow");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Copy Node logic similar to MessageNode
  const copyNode = useCallback(() => {
    const newId = `${Date.now()}`; // Unique ID for new node
    setNodes((nds) => {
      const nodeToCopy = getNode(id); // Get the current node by ID

      if (!nodeToCopy) return nds; // If the node doesn't exist, return the current nodes

      const highestZIndex = Math.max(
        ...getNodes().map((node) => node.style?.zIndex || 0) // Find the highest z-index
      );

      // Create a copy of the node
      const newNode = {
        ...nodeToCopy,
        id: newId, // New ID for the copied node
        position: {
          x: nodeToCopy.position.x + 150, // Offset the position to avoid overlap
          y: nodeToCopy.position.y + 150,
        },
        data: {
          ...nodeToCopy.data, // Copy the data
        },
        selected: false, // New node shouldn't be selected by default
        style: {
          ...nodeToCopy.style,
          zIndex: highestZIndex + 1, // Set z-index higher than all existing nodes
        },
      };

      return nds
        .map((node) => ({ ...node, selected: false })) // Deselect all nodes
        .concat({ ...newNode, selected: true }); // Add the copied node and select it
    });

    setIsMenuOpen(false); // Close the menu after copying
  }, [id, setNodes, getNode, getNodes]);

  // Delete Node logic similar to MessageNode
  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node by filtering it out
    setIsMenuOpen(false); // Hide menu after action
  };

  // Edit Node (already handled correctly)
  const handleEditClick = () => {
    data.openModal(); // Call the existing open modal function for editing
    setIsMenuOpen(false); // Close the menu after action
  };

  // Handle outside click to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks inside the React Flow container
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) && // Click outside menu
        buttonRef.current &&
        !buttonRef.current.contains(event.target) && // Click outside button
        !reactFlowWrapper.contains(event.target) // Ensure clicks inside ReactFlow container are ignored
      ) {
        setIsMenuOpen(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Detect clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, [menuRef, buttonRef, reactFlowWrapper]); // Add buttonRef and menuRef to dependencies

  return (
    <div
      className="w-72 rounded-lg shadow-md border border-gray-300 cursor-grab"
      onDoubleClick={data.openModal}
    >
      <div className="flex justify-between items-center px-3 py-2 bg-orange-500 rounded-t-lg">
        <div className="text-white text-xl font-semibold flex items-center gap-2">
          <span className="text-3xl">?</span>
          Question
        </div>

        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="text-white text-2xl font-bold"
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 -top-28 bg-white border rounded shadow-md text-sm"
          >
            <ul className="w-36 p-2 flex flex-col gap-2 font-medium text-[#666666]">
              <li
                onClick={handleEditClick}
                className="flex items-center gap-2 hover:bg-gray-50 cursor-pointer"
              >
                <img src="/assets/images/svg/edit.svg" alt="edit" />
                <span>Edit</span>
              </li>

              <hr />

              <li
                onClick={copyNode}
                className="flex items-center gap-2.5 hover:bg-gray-50 cursor-pointer"
              >
                <img src="/assets/images/svg/copy.svg" alt="copy" />
                <span>Copy</span>
              </li>

              <hr />

              <li
                onClick={deleteNode}
                className="flex items-center pl-1 gap-3.5 hover:bg-gray-50 cursor-pointer"
              >
                <FontAwesomeIcon icon={faTrashCan} className="text-[#666666]" />
                <span>Delete</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="px-3 bg-white text-lg font-medium">
        {data.label && <p className="pt-2">{data.label}</p>}
      </div>

      <div className="p-3 bg-white rounded-b-lg">
        {data.answerOptions && data.answerOptions.length > 0 ? (
          <ul className="space-y-2">
            {data.answerOptions.map((option, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-slate-50 p-2 rounded-lg cursor-pointer"
              >
                <span className="text-center flex-1">{option}</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Double tap to add Question and Answer options</p>
        )}
      </div>

      <Handle type="source" position="right" className="bg-gray-600" />
      <Handle type="target" position="left" className="bg-gray-600" />
    </div>
  );
};

export default QuestionNode;
