import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPaperclip,
    faSmile,
    faBolt,
    faTimes,
    faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";

import Button from "../../Button";
import Modal from "../../Modal";
import Templates from "./Templates";
import FileUploadModal from "./FileUploadModal";
import QuickReplyMessages from "./QuickReplyMessages";

import { fetchSelectedChatData } from "../../../services/api";

const ChatFooter = ({ templates, user, selectedChat, updateChatMessages }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");
    const [showTemplateButton, setShowTemplateButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFileMediaClicked, setIsFileMediaClicked] = useState(false);
    const [isQuickReplyModalOpen, setIsQuickReplyModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const messageRef = useRef(null);

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

    const handleQuickReplySelect = (quickReplyMessage, quickReplyMedia) => {
        console.log(quickReplyMedia);
        setMessage(quickReplyMessage);

        if (quickReplyMedia) {
            setSelectedMedia(quickReplyMedia); // Set the media URL directly
        } else {
            setSelectedMedia(null);
        }

        setIsQuickReplyModalOpen(false);
    };

    const handleSendMessage = async () => {
        if (!message.trim() && !selectedMedia) {
            return;
        }

        const formData = new FormData();
        formData.append("action", "create");
        formData.append("username", user);
        formData.append("receiver_id", selectedChat?.chat_room.receiver_id);
        formData.append("text", message);
        if (selectedMedia) {
            formData.append("media", selectedMedia);
        }
        formData.append("type", selectedMedia ? "media" : "text");
        formData.append("agent", user);
        formData.append("eventDescription", "Bot Replied");

        try {
            const response = await fetchSelectedChatData(formData);
            if (response?.data?.data) {
                updateChatMessages(response?.data?.data);
                setMessage(""); // Clear the message input after sending
                setSelectedMedia(null); // Clear the selected media after sending
            } else {
                toast.error("Failed to send message");
            }
        } catch (error) {
            toast.error("Failed to send message");
            console.error("Failed to send message", error);
        }
    };

    const renderMediaPreview = () => {
        if (!selectedMedia) return null;

        let mediaType, mediaName, mediaUrl;

        if (selectedMedia instanceof File) {
            mediaType = selectedMedia.type.split("/")[0];
            mediaName = selectedMedia.name;
            mediaUrl = URL.createObjectURL(selectedMedia);
        } else {
            // Handle URL string case
            mediaUrl = selectedMedia;
            mediaName = selectedMedia.split("/").pop();
            mediaType = mediaName.split(".").pop().toLowerCase(); // Guess media type by extension
        }

        switch (mediaType) {
            case "image":
            case "jpeg":
            case "jpg":
            case "png":
            case "gif":
                return (
                    <div className="flex items-center">
                        <img
                            src={mediaUrl}
                            alt="Selected"
                            className="max-h-32 mr-4"
                        />
                        <span className="mr-4 w-40 truncate font-semibold">
                            {mediaName}
                        </span>
                    </div>
                );
            case "video":
            case "mp4":
            case "webm":
            case "ogg":
                return (
                    <div className="flex items-center">
                        <video
                            src={mediaUrl}
                            controls
                            className="max-h-32 mr-4"
                        />
                        <span className="mr-4 w-40 truncate font-semibold">
                            {mediaName}
                        </span>
                    </div>
                );
            case "audio":
            case "mp3":
            case "wav":
            case "ogg":
                return (
                    <div className="flex items-center">
                        <audio src={mediaUrl} controls className="mr-4" />
                        <span className="mr-4 w-40 truncate font-semibold">
                            {mediaName}
                        </span>
                    </div>
                );
            case "application":
            case "pdf":
                if (mediaType === "pdf") {
                    return (
                        <div className="flex items-center">
                            <iframe
                                src={mediaUrl}
                                title={mediaName}
                                className="max-h-32 mr-4 w-full"
                            />
                            <span className="mr-4 w-40 truncate font-semibold">
                                {mediaName}
                            </span>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faFileAlt}
                                className="text-gray-500 text-4xl mr-4"
                            />
                            <span className="mr-4 w-40 truncate font-semibold">
                                {mediaName}
                            </span>
                        </div>
                    );
                }
            default:
                return (
                    <div className="flex items-center">
                        <span className="mr-4">Document: {mediaName}</span>
                    </div>
                );
        }
    };

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.style.height = "auto"; // Reset the height
            messageRef.current.style.height = `${messageRef.current.scrollHeight}px`; // Set the height to match content
        }
    }, [message]);

    useEffect(() => {
        let objectUrl = null;
        if (selectedMedia instanceof File) {
            objectUrl = URL.createObjectURL(selectedMedia);
        }
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [selectedMedia]);

    return (
        <div className="flex justify-between items-center bg-white shadow-2xl mx-1 mb-10 px-8 py-4 rounded-sm relative">
            {selectedMedia && (
                <div className="absolute -top-40 left-0 bg-slate-50 bg-opacity-85">
                    <div className="p-4">
                        {renderMediaPreview()}

                        <button
                            className="text-red-600 border border-red-600 text-lg py-1 px-2 rounded-md absolute right-0 top-0"
                            onClick={() => setSelectedMedia(null)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            )}
            <textarea
                ref={messageRef}
                value={message}
                onChange={handleInputChange}
                rows={1}
                className="w-[60%] max-h-16 overflow-auto resize-none border-none focus:outline-none scrollbar-hide"
                placeholder="Type a message here."
            />

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
                            onClick={handleSendMessage}
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
                    <FileUploadModal
                        setSelectedMedia={setSelectedMedia}
                        closeModal={handleFileClicked}
                    />
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
                    <QuickReplyMessages
                        user={user}
                        onQuickReplySelect={handleQuickReplySelect}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ChatFooter;
