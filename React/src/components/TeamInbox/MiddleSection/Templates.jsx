import { useState } from "react";

import Input from "../../Input";
import Button from "../../Button";

import { toast } from "react-toastify";

import { fetchSelectedChatData, sendCrmBroadcast } from "../../../services/api";

const Templates = ({
  templates,
  handleModal,
  selectedChat,
  selectedContacts,
  user,
  updateChatMessages,
  closeChooseChannelModal,
  setSelectedTickets,
  agent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.template_body.toLowerCase().includes(searchTerm.toLowerCase())
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
    handleModal(false);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    setMediaFile(file);

    // Create a preview URL for media display
    const fileURL = URL.createObjectURL(file);
    setMediaPreview(fileURL);
  };

  const sendSelectedTemplate = async () => {
    if (!selectedTemplate) return;

    let message = selectedTemplate?.template_body;
    Object.keys(customFields).forEach((field) => {
      message = message.replace(`{{${field}}}`, customFields[field]);
    });

    // Construct the customFieldAttributes array for "attributes" field
    const customFieldAttributesArray = Object.keys(customFields).map(
      (field, index) => ({
        [`attribute${index + 1}`]: customFields[field],
      })
    );

    const customFieldAttributesObject = Object.keys(customFields).reduce(
      (acc, field, index) => ({
        ...acc,
        [`attribute${index + 1}`]: customFields[field],
      }),
      {}
    );

    if (selectedContacts && selectedContacts.length > 0) {
      // Broadcast to multiple contacts
      const textbox = selectedContacts.join("\n"); // Join receiver_ids by newline

      const payload = {
        username: user,
        template_name: selectedTemplate.template_name,
        template_id: selectedTemplate.id,
        textbox: textbox,
        attributes: customFieldAttributesArray,
        ...customFieldAttributesObject, // Spread custom fields as attributes
      };

      try {
        const response = await sendCrmBroadcast(payload);
        if (response?.data?.status) {
          handleModal(false);
          closeChooseChannelModal();

          setSelectedTickets([]);
          toast.success("Message broadcasted successfully!");
        } else {
          toast.error("Failed to send broadcast message");
        }
      } catch (error) {
        toast.error("Failed to send broadcast message");
        console.error("Failed to send broadcast message", error);
      }
    } else if (selectedChat) {
      const data = new FormData();
      data.append("action", "create");
      data.append("username", user);
      data.append("template_name", selectedTemplate.template_name);
      data.append("template_id", selectedTemplate.id);
      data.append("text", message);
      data.append("attributes", JSON.stringify(customFieldAttributesArray));

      if (mediaFile) {
        data.append("template_media", mediaFile); // Append media file
      }

      data.append("receiver_id", selectedChat?.chat_room.receiver_id); // For single chat
      data.append("type", mediaFile ? "media" : "text");
      data.append("agent", agent);
      data.append("eventDescription", "agent");

      try {
        const response = await fetchSelectedChatData(data);

        if (response?.data?.data) {
          updateChatMessages(response?.data?.data);
          handleModal(false); // Close the modal after sending
          toast.success("Message sent successfully!");
        } else {
          toast.error("Failed to send message");
        }
      } catch (error) {
        toast.error("Failed to send message");
      }
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

            <p className="whitespace-pre-wrap">{template?.template_body}</p>

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
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      className="mt-1 block w-full"
                    />
                  </div>
                ))}

                {selectedTemplate?.header_media_type && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload {selectedTemplate.header_media_type}
                    </label>
                    <input
                      type="file"
                      accept={
                        selectedTemplate.header_media_type === "Image"
                          ? "image/*"
                          : selectedTemplate.header_media_type === "Audio"
                          ? "audio/*"
                          : selectedTemplate.header_media_type === "Video"
                          ? "video/*"
                          : selectedTemplate.header_media_type === "Document"
                          ? ".pdf,.doc,.docx,.txt" // Adjust accepted file types for documents
                          : "*"
                      }
                      onChange={handleMediaUpload}
                      className="mt-1 block w-full"
                    />
                    {/* Show media preview */}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Image" && (
                        <img
                          src={mediaPreview}
                          alt="preview"
                          className="mt-2 h-40"
                        />
                      )}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Audio" && (
                        <audio controls className="mt-2">
                          <source src={mediaPreview} />
                          Your browser does not support the audio tag.
                        </audio>
                      )}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Video" && (
                        <video controls className="mt-2 h-40">
                          <source src={mediaPreview} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Document" && (
                        <div className="mt-2">
                          {mediaFile.type === "application/pdf" ? (
                            <iframe
                              src={mediaPreview}
                              className="w-full h-40"
                              title="PDF Preview"
                            />
                          ) : (
                            <p className="text-gray-700">
                              {mediaFile.name} (Preview not supported)
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="secondary" onClick={handleBackClick}>
                    Back
                  </Button>

                  <Button variant="primary" onClick={sendSelectedTemplate}>
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
