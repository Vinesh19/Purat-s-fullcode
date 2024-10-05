import { useState, useCallback, useRef, useEffect } from "react";
import { Handle, useReactFlow } from "reactflow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const ListNode = ({ id, data }) => {
  const { setNodes, getNode } = useReactFlow();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const reactFlowWrapper = document.querySelector(".react-flow");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const copyNode = useCallback(() => {
    const newId = `${Date.now()}`;
    setNodes((nds) => {
      const nodeToCopy = getNode(id);
      if (!nodeToCopy) return nds;
      const newNode = {
        ...nodeToCopy,
        id: newId,
        position: {
          x: nodeToCopy.position.x + 150,
          y: nodeToCopy.position.y + 150,
        },
        data: { ...nodeToCopy.data },
        selected: false,
      };
      return nds.map((node) => ({ ...node, selected: false })).concat(newNode);
    });
    setIsMenuOpen(false);
  }, [id, setNodes, getNode]);

  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setIsMenuOpen(false);
  };

  const handleEditClick = () => {
    data.openModal();
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
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
        <div className="text-white text-lg font-semibold flex items-center gap-2">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-4 h-[2px] bg-white"></div>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-4 h-[2px] bg-white"></div>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-4 h-[2px] bg-white"></div>
            </div>
          </div>
          List
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

      <div className="p-3">
        {data.bodyText && <p>{data.bodyText}</p>}

        {data.sections && data.sections.length > 0 ? (
          data.sections.map((section, index) => (
            <div key={index} className="mt-3">
              {" "}
              {/* Added margin here */}
              <div className="font-medium">{section.title}</div>
              {section.rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex justify-between items-center bg-slate-50 p-2 rounded-lg mb-1"
                >
                  <span className="flex-1">{row}</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="font-normal">Double tap to add sections and rows</p>
        )}
      </div>

      <Handle type="source" position="right" className="bg-gray-600" />
      <Handle type="target" position="left" className="bg-gray-600" />
    </div>
  );
};

export default ListNode;
