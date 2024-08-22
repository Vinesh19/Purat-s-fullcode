import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../../Dropdown";
import Input from "../../Input";
import Button from "../../Button";

const ContactTemplate = ({ templates, setShowContactTemplate, contacts }) => {
    const [selectedContact, setSelectedContact] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showTemplates, setShowTemplates] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [customFields, setCustomFields] = useState({});
    const [error, setError] = useState("");

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
            template.template_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            template.template_body
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const transformedContacts = contacts.map((contact) => ({
        id: contact.receiver_id,
        name: `${contact.replySourceMessage} (${contact.receiver_id})`,
    }));

    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        const regex = /{{(.*?)}}/g;
        const matches = [...template.template_body.matchAll(regex)].map(
            (match) => match[1]
        );
        const fields = matches.reduce((acc, field) => {
            acc[field] = "";
            return acc;
        }, {});
        setCustomFields(fields);
    };

    const handleFieldChange = (field, value) => {
        setCustomFields({
            ...customFields,
            [field]: value,
        });
    };

    const handleBackClick = () => {
        setSelectedTemplate(null);
        setShowTemplates(false);
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
                            options={transformedContacts} // Update with actual ContactList options
                            value={selectedContact}
                            onChange={handleContactChange}
                            placeholder="Search contacts"
                        />
                        {error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )}
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
                <div className="overflow-y-scroll h-[64vh] scrollbar-hide">
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
                            <h3 className="font-bold">
                                {template?.template_name}
                            </h3>

                            <p>{template?.template_body}</p>

                            <div className="flex justify-evenly gap-1 mt-4">
                                {template?.quick_reply_btn_text1 && (
                                    <Button variant="secondary">
                                        {template?.quick_reply_btn_text1}
                                    </Button>
                                )}
                                {template?.quick_reply_btn_text2 && (
                                    <Button variant="secondary">
                                        {template?.quick_reply_btn_text2}
                                    </Button>
                                )}
                                {template?.quick_reply_btn_text3 && (
                                    <Button variant="secondary">
                                        {template?.quick_reply_btn_text3}
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

                                        <Button variant="primary">Send</Button>
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
