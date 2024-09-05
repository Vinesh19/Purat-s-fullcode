import { useNavigate } from "react-router-dom";

import Button from "../Button";

const ChatbotRecord = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/whatsapp/chatbotBuilder");
  };

  return (
    <div>
      <div className="flex justify-between bg-slate-50 p-4">
        <h3 className="font-semibold text-2xl">Chatbot flows</h3>

        <Button variant="primary" onClick={handleClick}>
          Add Chatbot
        </Button>
      </div>
    </div>
  );
};

export default ChatbotRecord;
