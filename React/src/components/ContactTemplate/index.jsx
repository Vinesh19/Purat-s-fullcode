import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../Dropdown";
import Input from "../Input";

import { ContactList } from "../../services/api";
import Button from "../Button";

const ContactTemplate = ({ templates, loading, setShowContactTemplate }) => {
    const [selectedContact, setSelectedContact] = useState("");
    const [showTemplates, setShowTemplates] = useState(false);

    const handleContactChange = (e) => {
        setSelectedContact(e.target.value);
    };

    const handleNextClick = () => {
        setShowTemplates(true);
    };

    const handleClose = () => {
        setShowContactTemplate(false); // Use setShowContactTemplate to close the template
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
                            placeholder="Please Input whatsapp Number"
                            className="grow"
                        />
                    </div>
                    <span className="font-medium">Or</span>
                    <div>
                        <Dropdown
                            options={ContactList} // Update with actual ContactList options
                            value={selectedContact}
                            onChange={handleContactChange}
                            placeholder="Search contacts"
                        />
                    </div>
                    <div className="flex gap-4 mt-5 justify-end">
                        <button
                            className="border px-6 py-2 rounded border-green-500 text-green-500"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button>Next</button>
                        <Button
                            className="border px-6 py-2 rounded bg-green-500 text-white"
                            onClick={handleNextClick}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {showTemplates && (
                <div className="overflow-y-scroll h-[70vh]">
                    <h2>Contact Templates:</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        templates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white p-2 m-2 rounded shadow-md"
                            >
                                <h3 className="font-bold">{template.name}</h3>
                                <p>{template.templateBody}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactTemplate;
