import { useState } from "react";
import Input from "../Input";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' formats the date as dd/mm/yyyy
};

const statusMapping = {
    5: "new",
    6: "qualified",
    7: "proposition",
    8: "won",
};

const ChatDetailModal = ({ data, onSave }) => {
    const [editData, setEditData] = useState({
        Name: data?.data?.replySourceMessage,
        Number: data?.data?.receiver_id,
        Agent: data?.data?.agent,
        Date: formatDate(data?.data?.updated_at), // Format the date here
        Notes: data?.notes,
        Status: data?.data?.chat_room?.status,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const handleSave = () => {
        onSave(editData);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">User's Information</h3>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Name"
                    name="Name"
                    value={editData.Name}
                    onChange={handleChange}
                />
                <Input
                    label="Number"
                    name="Number"
                    value={editData.Number}
                    onChange={handleChange}
                />
                <Input
                    label="Agent"
                    name="Agent"
                    value={editData.Agent}
                    onChange={handleChange}
                />
                <Input
                    label="Date"
                    name="Date"
                    value={editData.Date}
                    onChange={handleChange}
                />
                <Input
                    label="Status"
                    name="Status"
                    value={statusMapping[editData.Status]}
                    onChange={handleChange}
                />
                <Input
                    label="Notes"
                    name="Notes"
                    value={editData.Notes}
                    onChange={handleChange}
                />
            </div>

            <div className="mt-4">
                <h3 className="font-medium">Internal Notes</h3>
                <textarea
                    className="w-full p-2 border rounded"
                    name="internalNotes"
                    value={editData.internalNotes}
                    onChange={handleChange}
                    rows={5}
                />
            </div>

            <div className="mt-4">
                <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ChatDetailModal;
