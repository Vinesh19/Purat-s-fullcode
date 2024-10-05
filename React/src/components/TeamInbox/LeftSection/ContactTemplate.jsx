import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import Dropdown from "../../Dropdown";
import Input from "../../Input";
import Button from "../../Button";

import { fetchSelectedChatData } from "../../../services/api";

import "react-toastify/dist/ReactToastify.css";

const ContactTemplate = ({
  templates,
  setShowContactTemplate,
  contacts,
  user,
  updateChatMessages,
}) => {
  const [selectedContact, setSelectedContact] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [error, setError] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const extractReceiverId = (contactString) => {
    const match = contactString.match(/\(([^)]+)\)$/);
    return match ? match[1] : null;
  };

  const handleContactChange = (e) => {
    setSelectedContact(e.target.value);
    setError("");
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    setError("");
  };

  const handleNextClick = () => {
    if (!selectedContact && !phoneNumber) {
      setError("Please select a contact or enter a phone number.");
      return;
    }
    setSelectedTemplate(null);
    setCustomFields({});
    setShowTemplates(true);
  };

  const handleClose = () => {
    setShowContactTemplate(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.template_body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const transformedContacts = contacts.map((contact) => ({
    id: contact.receiver_id,
    name: `${contact.replySourceMessage} (${contact.receiver_id})`,
    chat_room: contact.chat_room || {},
  }));

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
    setSelectedTemplate(null);
    setShowTemplates(false);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);

    // Create a preview URL for media display
    const fileURL = URL.createObjectURL(file);
    setMediaPreview(fileURL);
  };

  const handleSendMessage = async () => {
    if (!selectedTemplate) return;

    // Construct the message by replacing placeholders with custom field values
    const message = selectedTemplate.template_body.replace(
      /{{(.*?)}}/g,
      (_, field) => customFields[field] || ""
    );

    // Create the attributes array of objects in the desired format
    const attributes = Object.keys(customFields).map((field, index) => ({
      [`attribute${index + 1}`]: customFields[field], // Object for each custom field
    }));

    const selectedContactObject = contacts.find(
      (contact) => contact.receiver_id === extractReceiverId(selectedContact)
    );

    const agent =
      selectedContactObject?.chat_room?.assign_user?.assign_user ||
      "default_agent";

    const data = new FormData();
    data.append("action", "createTemplate");
    data.append("username", user);
    data.append("template_name", selectedTemplate?.template_name);
    data.append("template_id", selectedTemplate?.id);
    data.append("text", message);
    data.append("attributes", JSON.stringify(attributes));

    if (mediaFile) {
      data.append("template_media", mediaFile); // Append media file

      const mediaType = mediaFile.type.split("/")[0]; // Determine media type (e.g., 'image', 'video')
      data.append("template_media_type", mediaType);
    }

    data.append(
      "receiver_id",
      selectedContact ? extractReceiverId(selectedContact) : phoneNumber
    );
    data.append("type", mediaFile ? "media" : "text");
    data.append("agent", agent);
    data.append("eventDescription", "agent");

    try {
      const response = await fetchSelectedChatData(data);

      if (response?.data?.data) {
        updateChatMessages(response?.data?.data);
        setShowContactTemplate(false);
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="bg-slate-100 rounded-lg p-3 flex flex-col gap-2 text-center">
      {!showTemplates && (
        <div>
          <h3 className="font-semibold text-lg">Choose contact</h3>
          <div className="flex gap-3 items-center">
            <FontAwesomeIcon
              icon={faPhone}
              className="bg-white p-1.5 rounded"
            />

            <Input
              placeholder="Please Input WhatsApp Number"
              className="grow"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </div>

          <span className="font-medium">Or</span>

          <div>
            <Dropdown
              options={transformedContacts}
              value={selectedContact}
              onChange={handleContactChange}
              placeholder="Search contacts"
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>

          <div className="flex gap-4 mt-5 justify-end">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

            <Button variant="primary" onClick={handleNextClick}>
              Next
            </Button>
          </div>
        </div>
      )}

      {showTemplates && (
        <div className="overflow-y-scroll h-[64vh] overflow-x-hidden scrollbar-hide">
          <h2 className="text-lg font-medium">Select Template</h2>
          <Input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="my-4"
          />
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

              {selectedTemplate?.id === template?.id && (
                <div className="mt-4">
                  {Object.keys(customFields).map((field) => (
                    <div key={field} className="my-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Custom Field {`{{${field}}}`}
                      </label>

                      <Input
                        value={customFields[field]}
                        onChange={(e) =>
                          handleFieldChange(field, e.target.value)
                        }
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
                      {mediaPreview && (
                        <div className="mt-4">
                          {selectedTemplate?.header_media_type === "Image" && (
                            <img
                              src={mediaPreview}
                              alt="preview"
                              className="mt-2 h-40"
                            />
                          )}

                          {selectedTemplate?.header_media_type === "Audio" && (
                            <audio controls className="mt-2">
                              <source src={mediaPreview} />
                              Your browser does not support the audio tag.
                            </audio>
                          )}

                          {selectedTemplate?.header_media_type === "Video" && (
                            <video controls className="mt-2 h-40">
                              <source src={mediaPreview} />
                              Your browser does not support the video tag.
                            </video>
                          )}

                          {selectedTemplate?.header_media_type ===
                            "Document" && (
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
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="secondary" onClick={handleBackClick}>
                      Back
                    </Button>

                    <Button variant="primary" onClick={handleSendMessage}>
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactTemplate;
