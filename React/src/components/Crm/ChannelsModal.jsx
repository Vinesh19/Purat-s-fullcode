import { useState, useEffect } from "react";

import Modal from "../Modal";
import Templates from "../TeamInbox/MiddleSection/Templates";

import { templateData } from "../../services/api";

const ChooseChannel = ({
  user,
  selectedContacts,
  closeChooseChannelModal,
  setSelectedTickets,
}) => {
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTemplatesAndMessages = async () => {
    const response = await templateData({
      username: user,
      action: "read",
    });

    setTemplates(response?.data?.template || []);
  };

  const handleModalClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    fetchTemplatesAndMessages();
  }, []);

  return (
    <div>
      <h2 className=" font-semibold text-xl">Choose Channel</h2>

      <div className="grid xs:grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mt-6">
        {/* SMS */}
        <div className="flex items-center justify-center gap-2 py-2 bg-white rounded-lg shadow-lg cursor-pointer">
          <img
            src="/assets/images/svg/chat.svg"
            alt="SMS Icon"
            className="w-6 h-5"
          />
          <h4 className="text-lg font-semibold text-gray-800">SMS</h4>
        </div>
        {/* Voice */}
        <div className="flex items-center justify-center gap-2 py-2 bg-white rounded-lg shadow-lg cursor-pointer">
          <img
            src="/assets/images/svg/voice-recognition.svg"
            alt="Voice Icon"
            className="w-7 h-6"
          />
          <h4 className="text-lg font-semibold text-gray-800">Voice</h4>
        </div>
        {/* WhatsApp */}
        <div
          className="flex items-center justify-center gap-2 py-2 bg-white rounded-lg shadow-lg cursor-pointer"
          onClick={handleModalClick}
        >
          <img
            src="/assets/images/svg/whatsapp.svg"
            alt="WhatsApp Icon"
            className="w-6 h-6"
          />
          <h4 className="text-lg font-semibold text-gray-800">WhatsApp</h4>
        </div>
        {/* RCS */}
        <div className="flex items-center justify-center gap-2 py-2 bg-white rounded-lg shadow-lg cursor-pointer">
          <img
            src="/assets/images/svg/rcs.svg"
            alt="RCS Icon"
            className="w-9.5 h-8"
          />
          <h4 className="text-lg font-semibold text-gray-800">RCS</h4>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={handleModalClick}
          width="50vw"
          height="60vh"
          className="bottom"
        >
          <Templates
            templates={templates}
            handleModal={setIsModalOpen}
            user={user}
            selectedContacts={selectedContacts}
            closeChooseChannelModal={closeChooseChannelModal}
            setSelectedTickets={setSelectedTickets}
          />
        </Modal>
      )}
    </div>
  );
};

export default ChooseChannel;
