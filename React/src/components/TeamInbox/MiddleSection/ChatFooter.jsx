import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faSmile, faBolt } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";

import Input from "../../Input";
import Button from "../../Button";
import Modal from "../../Modal";
import Templates from "./Templates";
import FileUploadModal from "./FileUploadModal";
import QuickReplyMessages from "./QuickReplyMessages";

const ChatFooter = ({ templates }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");
    const [showTemplateButton, setShowTemplateButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFileMediaClicked, setIsFileMediaClicked] = useState(false);
    const [isQuickReplyModalOpen, setIsQuickReplyModalOpen] = useState(false);

    const onEmojiClick = (event) => {
        setMessage((prevMessage) => prevMessage + event.emoji);
        setShowEmojiPicker(false);
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const toggleTemplateButton = () => {
        setShowTemplateButton(!showTemplateButton);
    };

    const handleModalClick = () => {
        setShowTemplateButton(false);
        setIsModalOpen(!isModalOpen);
    };

    const handleFileClicked = () => {
        setIsFileMediaClicked(!isFileMediaClicked);
    };

    const handleQuickReplyClick = () => {
        setIsQuickReplyModalOpen(!isQuickReplyModalOpen);
    };

    return (
        <div className="flex justify-between bg-white shadow-2xl mx-1 mb-4 px-8 py-4 rounded-sm">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Type a message here."
                    value={message}
                    onChange={handleInputChange}
                    noBorder={true}
                    autoFocus={true}
                    className="w-96"
                />
            </div>

            <div className="flex gap-4 items-center relative">
                <FontAwesomeIcon
                    icon={faSmile}
                    className="text-gray-400 text-xl cursor-pointer"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />

                <FontAwesomeIcon
                    icon={faPaperclip}
                    className="text-gray-400 text-xl rotate-[-45deg] cursor-pointer"
                    onClick={handleFileClicked}
                />

                <FontAwesomeIcon
                    icon={faBolt}
                    className="text-gray-400 text-xl cursor-pointer"
                    onClick={handleQuickReplyClick}
                />

                <div className="relative">
                    <div>
                        <Button
                            variant="primary"
                            className="rounded-r-none border-r-green-300"
                        >
                            Send
                        </Button>
                        <Button
                            variant="primary"
                            className="px-[8px] py-0 rounded-l-none"
                            onClick={toggleTemplateButton}
                        >
                            ^
                        </Button>
                    </div>

                    {showTemplateButton && (
                        <Button
                            variant="primary"
                            className="absolute -top-11"
                            onClick={handleModalClick}
                        >
                            Template
                        </Button>
                    )}
                </div>

                {showEmojiPicker && (
                    <div className="absolute bottom-14 right-0">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={handleModalClick}
                    width="50vw"
                    height="50vh"
                    className="bottom-0 border-4 border-green-100"
                >
                    <Templates templates={templates} />
                </Modal>
            )}

            {isFileMediaClicked && (
                <Modal
                    isModalOpen={isFileMediaClicked}
                    closeModal={handleFileClicked}
                    width="50vw"
                    height="50vh"
                    className="rounded-lg"
                >
                    <FileUploadModal />
                </Modal>
            )}

            {isQuickReplyModalOpen && (
                <Modal
                    isModalOpen={isQuickReplyModalOpen}
                    closeModal={handleQuickReplyClick}
                    width="60vw"
                    height="90vh"
                    className="rounded-lg"
                >
                    <QuickReplyMessages templates={templates} />
                </Modal>
            )}
        </div>
    );
};

export default ChatFooter;
