import { useState, useRef, useCallback } from "react";
import { Handle, useReactFlow } from "reactflow";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import DeleteIcon from "@mui/icons-material/Delete";

const MessageNode = ({ id, data }) => {
  const { setNodes, getNode, getNodes } = useReactFlow();

  const [showMenu, setShowMenu] = useState(false);
  const [inputs, setInputs] = useState({
    messages: [],
    images: [],
    videos: [],
    audios: [],
    documents: [],
  });

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
          zIndex: highestZIndex + 1, // Set z-index higher than all existing nodes
        },
      };
      return nds
        .map((node) => ({ ...node, selected: false }))
        .concat({ ...newNode, selected: true });
    });
    setShowMenu(false);
  }, [id, setNodes, getNode]);

  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setShowMenu(false); // Hide menu after action
  };

  const fileInputRefs = {
    images: useRef(null),
    videos: useRef(null),
    audios: useRef(null),
    documents: useRef(null),
  };

  const addField = (fieldType) => {
    setInputs((prev) => ({
      ...prev,
      [fieldType]: [...prev[fieldType], ""],
    }));
  };

  const removeField = (fieldType, index) => {
    setInputs((prev) => ({
      ...prev,
      [fieldType]: prev[fieldType].filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (fieldType, index, value) => {
    setInputs((prev) => {
      const updatedFields = [...prev[fieldType]];
      updatedFields[index] = value;
      return {
        ...prev,
        [fieldType]: updatedFields,
      };
    });
  };

  const handleFileChange = (fieldType, index, e) => {
    const file = e.target.files[0];
    handleInputChange(fieldType, index, file);
  };

  const triggerFileInput = (fieldType, index) => {
    fileInputRefs[fieldType].current.click();
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow-md cursor-grab">
      <div className="flex justify-between items-center bg-red-500 p-3 rounded-t-lg">
        <div className="text-white text-2xl font-semibold flex items-center gap-1">
          <span>💬</span>
          <span className="text-xl">Send a message</span>
        </div>

        <button
          className="text-white text-2xl font-bold"
          onClick={() => setShowMenu(!showMenu)} // Toggle menu on click
        >
          ⋮
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-0 -top-20 bg-white border shadow-md rounded p-2">
          <ul className="w-36 text-sm font-medium flex flex-col gap-2 text-[#666666]">
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
              <FontAwesomeIcon icon={faTrashCan} className=" text-[#666666]" />
              <span>Delete</span>
            </li>
          </ul>
        </div>
      )}

      <div className="p-3 flex flex-col gap-4">
        {/* Render multiple message textareas */}
        {inputs.messages.map((message, index) => (
          <div key={index} className="flex">
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 h-24 resize-none"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) =>
                handleInputChange("messages", index, e.target.value)
              }
            />

            <button
              onClick={() => removeField("messages", index)}
              className="text-red-500"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}

        {/* Render multiple image upload fields */}
        {inputs.images.map((image, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-2xl">🖼️</span>
            <button
              className="w-full text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
              onClick={() => triggerFileInput("images", index)}
            >
              Upload image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRefs.images}
              onChange={(e) => handleFileChange("images", index, e)}
              className="hidden"
            />
            <button
              onClick={() => removeField("images", index)}
              className="text-red-500"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}

        {/* Render multiple video upload fields */}
        {inputs.videos.map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-2xl">🎥</span>
            <button
              className="w-full text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
              onClick={() => triggerFileInput("videos", index)}
            >
              Upload video
            </button>
            <input
              type="file"
              accept="video/*"
              ref={fileInputRefs.videos}
              onChange={(e) => handleFileChange("videos", index, e)}
              className="hidden"
            />
            <button
              onClick={() => removeField("videos", index)}
              className="text-red-500"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}

        {/* Render multiple audio upload fields */}
        {inputs.audios.map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <button
              className="w-full text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
              onClick={() => triggerFileInput("audios", index)}
            >
              Upload audio
            </button>
            <input
              type="file"
              accept="audio/*"
              ref={fileInputRefs.audios}
              onChange={(e) => handleFileChange("audios", index, e)}
              className="hidden"
            />
            <button
              onClick={() => removeField("audios", index)}
              className="text-red-500"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}

        {/* Render multiple document upload fields */}
        {inputs.documents.map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <button
              className="w-full text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
              onClick={() => triggerFileInput("documents", index)}
            >
              Upload document
            </button>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              ref={fileInputRefs.documents}
              onChange={(e) => handleFileChange("documents", index, e)}
              className="hidden"
            />
            <button
              onClick={() => removeField("documents", index)}
              className="text-red-500"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}

        {/* Buttons to add new upload fields */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addField("messages")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-50"
          >
            Message
          </button>

          <button
            onClick={() => addField("images")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-50"
          >
            Image
          </button>

          <button
            onClick={() => addField("videos")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-50"
          >
            Video
          </button>

          <button
            onClick={() => addField("audios")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-50"
          >
            Audio
          </button>

          <button
            onClick={() => addField("documents")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-50 col-span-2"
          >
            Document
          </button>
        </div>
      </div>

      <Handle type="source" position="right" className="bg-gray-600" />
      <Handle type="target" position="left" className="bg-gray-600" />
    </div>
  );
};

export default MessageNode;
