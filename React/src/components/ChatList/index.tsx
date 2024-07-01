import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../Dropdown";
import Modal from "../Modal";
import FilterConversation from "../FilterConversation";
import ContactTemplate from "../ContactTemplate";
import {
    TeamInbox,
    templateData,
    fetchTemplateMessage,
} from "../../services/api";
import { toast } from "react-toastify";

const ChatList = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [selectedChatMessages, setSelectedChatMessages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showContactTemplate, setShowContactTemplate] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChatSelect = (id) => {
        const selectedChat = TeamInbox.find((chat) => chat.id === id);
        setSelectedChatId(id);
        setSelectedChatMessages(selectedChat ? selectedChat.message : []);
        setShowContactTemplate(false); // Ensure contact template is hidden when switching chats
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMessages = selectedChatMessages.filter((message) =>
        message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleContactTemplate = async () => {
        setShowContactTemplate(!showContactTemplate);
        if (!showContactTemplate) {
            await fetchTemplatesAndMessages();
        }
    };

    const fetchTemplatesAndMessages = async () => {
        try {
            setLoading(true);
            const response = await templateData();
            if (response?.data?.template) {
                const templatesArray = Object.entries(
                    response.data.template
                ).map(([id, name]) => ({ id, name }));

                const templatesWithMessages = await Promise.all(
                    templatesArray.map(async (template) => {
                        try {
                            const messageResponse = await fetchTemplateMessage(
                                template.id
                            );
                            const templateBody =
                                messageResponse?.data?.template
                                    ?.template_body || "No message available";
                            return { ...template, templateBody };
                        } catch (error) {
                            console.error(
                                `Failed to fetch message for template ${template.id}`,
                                error
                            );
                            return {
                                ...template,
                                templateBody: "Failed to fetch message",
                            };
                        }
                    })
                );

                setTemplates(templatesWithMessages);
            } else {
                toast.error("No templates found");
            }
        } catch (error) {
            toast.error("Failed to fetch templates");
            console.error("Failed to fetch templates", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div>
                <div className="flex bg-slate-50 text-slate-400 rounded">
                    <div className="bg-slate-50 flex justify-center items-center gap-2 px-2 py-0.5 border-r rounded-l">
                        <FontAwesomeIcon
                            icon={faSearch}
                            size="xs"
                            className="text-slate-400 mt-1"
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-slate-50 outline-none"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="flex justify-center items-center">
                        <select
                            className="bg-slate-50 outline-none"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Messages
                            </option>
                            <option value="All">All</option>
                            <option value="Name or Phone">Name or Phone</option>
                            <option value="Messages">Messages</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2  border-b pb-4">
                    <div className="flex flex-col">
                        <Dropdown
                            options={TeamInbox.map(({ id, name }) => ({
                                id,
                                name,
                            }))}
                            value={selectedChatId}
                            onChange={(e) => handleChatSelect(e.target.value)}
                            placeholder="All Chats"
                            className="border-none w-40 font-medium text-xl pl-0"
                        />
                        <span className="text-xs text-slate-400">
                            {selectedChatMessages.length} messages
                        </span>
                    </div>

                    <div className="flex gap-5">
                        <FontAwesomeIcon
                            icon={faFilter}
                            onClick={handleModal}
                            className="border-8 rounded-full bg-slate-200 text-slate-600 h-5 cursor-pointer hover:outline hover:outline-lime-600"
                        />
                        <FontAwesomeIcon
                            icon={faPlus}
                            onClick={toggleContactTemplate}
                            className="border-8 rounded-full bg-slate-200 text-slate-600  h-5 cursor-pointer hover:text-lime-600"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {showContactTemplate ? (
                    <ContactTemplate
                        templates={templates}
                        loading={loading}
                        setShowContactTemplate={setShowContactTemplate}
                    />
                ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((message, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-4 rounded-md my-4"
                        >
                            <p>{message}</p>
                        </div>
                    ))
                ) : (
                    <p>No messages found.</p>
                )}
            </div>

            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    width="50vw"
                    height="60vh"
                >
                    <FilterConversation />
                </Modal>
            )}
        </div>
    );
};

export default ChatList;
