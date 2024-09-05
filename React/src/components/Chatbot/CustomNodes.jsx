import { useState, useRef } from "react";
import { Handle } from "reactflow";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Material-UI Delete Icon

const SendMessageNode = () => {
  const [inputs, setInputs] = useState({
    messages: [],
    images: [],
    videos: [],
    audios: [],
    documents: [],
  });

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
    <div className="w-72 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center bg-red-500 p-2 rounded-t-lg">
        <div className="text-white text-lg font-semibold flex items-center gap-1">
          <span>💬</span>
          Send a message
        </div>
        <button className="text-white text-xl font-bold">⋮</button>
      </div>

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
        {inputs.videos.map((video, index) => (
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
        {inputs.audios.map((audio, index) => (
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
        {inputs.documents.map((document, index) => (
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
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
          >
            Message
          </button>
          <button
            onClick={() => addField("images")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
          >
            Image
          </button>
          <button
            onClick={() => addField("videos")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
          >
            Video
          </button>
          <button
            onClick={() => addField("audios")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100"
          >
            Audio
          </button>
          <button
            onClick={() => addField("documents")}
            className="text-center text-green-500 border border-green-500 rounded-md py-2 hover:bg-green-100 col-span-2"
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

const QuestionNode = ({ data }) => {
  return (
    <div
      className="w-72 rounded-lg shadow-md border border-gray-300"
      onDoubleClick={data.openModal} // Trigger the modal from the passed data
    >
      <div className="flex justify-between items-center px-3 py-2 bg-orange-400 rounded-t-lg">
        <div className="text-white text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">?</span>
          Question
        </div>

        <button className="text-white text-xl font-bold">⋮</button>
      </div>

      {/* Content Section */}
      <div className="p-3 bg-white rounded-b-lg">
        {"Double Tap to ask a question"}
      </div>

      {/* Handles for connections */}
      <Handle type="source" position="right" className="bg-gray-600" />
      <Handle type="target" position="left" className="bg-gray-600" />
    </div>
  );
};

export default QuestionNode;

const ButtonsNode = ({ data }) => {
  return (
    <div className="p-3 bg-white border border-green-300 rounded-lg shadow-md">
      <strong className="block text-lg font-semibold">Buttons Node</strong>
      <div>{data.content || "Your buttons content here"}</div>
      <Handle type="source" position="right" className="bg-gray-600" />
      <Handle type="target" position="left" className="bg-gray-600" />
    </div>
  );
};

const ListNode = ({ data }) => {
  return (
    <div className="p-3 bg-white border border-purple-300 rounded-lg shadow-md">
      <strong className="block text-lg font-semibold">List Node</strong>
      <div>{data.content || "Your list content here"}</div>
      <Handle type="source" position="right" className="bg-gray-600" />
      <Handle type="target" position="left" className="bg-gray-600" />
    </div>
  );
};

export { SendMessageNode, QuestionNode, ButtonsNode, ListNode };
