import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateChatbotModal = () => {
  const navigate = useNavigate();
  const [chatbotName, setChatbotName] = useState("");

  const handleOpen = () => {
    if (chatbotName.trim()) {
      navigate("/dashboard/whatsapp/createChatbot", {
        state: { chatbotName },
      });
    } else {
      alert("Please enter a chatbot name.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOpen();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold pb-2 border-b border-gray-500">
          Add New Chatbot
        </h2>

        <p className="text-base font-semibold my-4">Chatbot Name</p>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter chatbot name"
          value={chatbotName}
          onChange={(e) => setChatbotName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 bg-gray-50 rounded-md outline-none"
        />
      </div>

      {/* Button aligned to the bottom-right */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleOpen}
          disabled={!chatbotName.trim()}
          className={`px-4 py-2 rounded-md text-white ${
            chatbotName.trim()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-blue-300 cursor-not-allowed"
          } transition`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CreateChatbotModal;
