import { useState, useCallback, useRef, useEffect } from "react";

import { Handle, useReactFlow } from "reactflow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const ButtonsNode = ({ id, data }) => {
  const { setNodes, getNode, getNodes } = useReactFlow();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // To toggle menu

  const menuRef = useRef(null); // Ref for the menu
  const buttonRef = useRef(null); // Ref for the toggle button
  const reactFlowWrapper = document.querySelector(".react-flow");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Copy Node logic
  const copyNode = useCallback(() => {
    const newId = `${Date.now()}`;
    setNodes((nds) => {
      const nodeToCopy = getNode(id);
      if (!nodeToCopy) return nds;

      const highestZIndex = Math.max(
        ...getNodes().map((node) => node.style?.zIndex || 0)
      );

      const newNode = {
        ...nodeToCopy,
        id: newId,
        position: {
          x: nodeToCopy.position.x + 150,
          y: nodeToCopy.position.y + 150,
        },
        data: {
          ...nodeToCopy.data,
        },
        selected: false,
        style: {
          ...nodeToCopy.style,
          zIndex: highestZIndex + 1,
        },
      };

      return nds
        .map((node) => ({ ...node, selected: false })) // Deselect all nodes
        .concat({ ...newNode, selected: true }); // Add the copied node and select it
    });

    setIsMenuOpen(false); // Close the menu after copying
  }, [id, setNodes, getNode, getNodes]);

  // Delete Node logic
  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id)); // Remove the node
    setIsMenuOpen(false); // Hide menu after action
  };

  // Edit Node (already handled correctly)
  const handleEditClick = () => {
    data.openModal();
    setIsMenuOpen(false);
  };

  // Handle outside click to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks inside the React Flow container
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        !reactFlowWrapper.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, buttonRef, reactFlowWrapper]);

  return (
    <div
      className="w-72 bg-white rounded-lg shadow-md border border-gray-300 cursor-grab"
      onDoubleClick={data.openModal}
    >
      <div className="flex justify-between items-center p-3 bg-orange-500 rounded-t-lg">
        <div className="text-white text-xl font-semibold flex gap-1">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 16"
              width="32"
              height="32"
            >
              <circle cx="8" cy="8" r="8" fill="white" />
              <circle cx="8" cy="8" r="7" fill="#ff9726" />
              <circle cx="8" cy="8" r="4" fill="white" />
            </svg>
          </span>
          Buttons
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
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className=" text-[#666666]"
                />
                <span>Delete</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="px-3 text-lg font-medium">
        {data.bodyText && <p className="pt-2">{data.bodyText}</p>}
      </div>

      <div className="p-3">
        {data.buttons && data.buttons.length > 0 ? (
          <ul className="space-y-2">
            {data.buttons.map((button, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-slate-50 p-2 rounded-lg cursor-pointer"
              >
                <span className="text-center flex-1">{button}</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Double tap to add buttons</p>
        )}
      </div>

      <Handle type="source" position="right" className="bg-gray-600" />
      <Handle type="target" position="left" className="bg-gray-600" />
    </div>
  );
};

export default ButtonsNode;
