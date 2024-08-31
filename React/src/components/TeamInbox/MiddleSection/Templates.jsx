import { useState } from "react";

import Input from "../../Input";
import Button from "../../Button";

import { toast } from "react-toastify";

import { fetchSelectedChatData } from "../../../services/api";

const Templates = ({
    templates,
    handleModal,
    selectedChat,
    user,
    updateChatMessages,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [customFields, setCustomFields] = useState({});

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTemplates = templates.filter(
        (template) =>
            template.template_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            template.template_body
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        const regex = /{{(.*?)}}/g;
        const matches = [...template.template_body.matchAll(regex)].map(
            (match) => match[1]
        );
        const fields = matches.reduce((acc, field) => {
            acc[field] = customFields[field] || ""; // Preserve existing values
            return acc;
        }, {});
        setCustomFields(fields);
    };

    const handleFieldChange = (field, value) => {
        setCustomFields((prevFields) => ({
            ...prevFields,
            [field]: value,
        }));
    };

    const handleBackClick = () => {
        setCustomFields({});
        setSearchTerm("");
        setSelectedTemplate(null);
    };

    const sendSelectedTemplate = async () => {
        if (!selectedTemplate || !selectedChat) return;

        // Construct the message by replacing placeholders with custom field values
        let message = selectedTemplate?.template_body;
        Object.keys(customFields).forEach((field) => {
            message = message.replace(`{{${field}}}`, customFields[field]);
        });

        // Create the attributes object
        const attributes = {};
        Object.keys(customFields).forEach((field, index) => {
            attributes[`attribute${index + 1}`] = customFields[field];
        });

        const formData = new FormData();
        formData.append("action", "create");
        formData.append("username", user);
        formData.append("receiver_id", selectedChat?.chat_room.receiver_id);
        formData.append("text", message);
        formData.append("type", "text");
        formData.append("agent", user);
        formData.append("eventDescription", "Bot Replied");
        formData.append("attributes", JSON.stringify(attributes)); // Append attributes object as JSON string

        try {
            const response = await fetchSelectedChatData(formData);
            if (response?.data?.data) {
                updateChatMessages(response?.data?.data);
                handleModal(false); // Close the modal after sending
                toast.success("Message sent successfully!");
            } else {
                toast.error("Failed to send message");
            }
        } catch (error) {
            toast.error("Failed to send message");
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 border-b-2 pb-4">
                <h2 className="text-lg font-semibold">Select Template</h2>

                <Input
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="overflow-y-auto scrollbar-hide">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className={`bg-white px-2 py-4 my-3 rounded shadow-md cursor-pointer hover:bg-slate-50 ${
                            selectedTemplate?.id === template.id
                                ? "border-2 border-green-500"
                                : ""
                        }`}
                        onClick={() => handleTemplateClick(template)}
                    >
                        <h3 className="font-bold">{template?.template_name}</h3>

                        <p className="whitespace-pre-wrap">
                            {template?.template_body}
                        </p>

                        <div className="flex justify-evenly gap-1 mt-4">
                            {template.quick_reply_btn_text1 && (
                                <Button variant="secondary">
                                    {template.quick_reply_btn_text1}
                                </Button>
                            )}
                            {template.quick_reply_btn_text2 && (
                                <Button variant="secondary">
                                    {template.quick_reply_btn_text2}
                                </Button>
                            )}
                            {template.quick_reply_btn_text3 && (
                                <Button variant="secondary">
                                    {template.quick_reply_btn_text3}
                                </Button>
                            )}
                        </div>

                        {selectedTemplate?.id === template.id && (
                            <div className="mt-4">
                                {Object.keys(customFields).map((field) => (
                                    <div key={field} className="my-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Custom Field {`{{${field}}}`}
                                        </label>

                                        <Input
                                            value={customFields[field]}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    field,
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                ))}
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={handleBackClick}
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        variant="primary"
                                        onClick={sendSelectedTemplate}
                                    >
                                        Send
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;
