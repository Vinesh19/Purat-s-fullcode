import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Button from "../Button";

const ContactTemplate = ({ templates, setShowContactTemplate, contacts }) => {
    console.log("contacts", contacts);
    const [selectedContact, setSelectedContact] = useState("");
    const [showTemplates, setShowTemplates] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleContactChange = (e) => {
        setSelectedContact(e.target.value);
    };

    const handleNextClick = () => {
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
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.templateBody
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const transformedContacts = contacts.map((contact) => ({
        id: contact.receiver_id,
        name: `${contact.replySourceMessage} (${contact.receiver_id})`,
    }));

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
                            placeholder="Please Input whatsapp Number"
                            className="grow"
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
                        className="mx-2 my-3"
                    />
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white p-2 m-2 rounded shadow-md cursor-pointer hover:bg-slate-50"
                        >
                            <h3 className="font-bold">{template.name}</h3>
                            <p>{template.templateBody}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactTemplate;
