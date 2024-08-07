import { useState } from "react";
import Input from "../Input";

const ChatDetailModal = ({ data, onSave }) => {
    const [editData, setEditData] = useState({
        Name: data?.data?.replySourceMessage,
        Number: data?.data?.receiver_id,
        Agent: data?.data?.agent,
        Date: data?.data?.updated_at,
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
            <h3 className="text-xl font-semibold">User's Information</h3>

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
                    value={editData.Status}
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
                <h3>Internal Notes</h3>
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
