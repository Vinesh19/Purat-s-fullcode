import { useState, useEffect } from "react";
import Button from "../Button";

const CreateQuickReply = ({ onSave, initialData }) => {
    const [title, setTitle] = useState(initialData ? initialData.title : "");
    const [message, setMessage] = useState(
        initialData ? initialData.message : ""
    );

    const handleSave = () => {
        onSave({ title, message });
        setTitle("");
        setMessage("");
    };

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setMessage(initialData.message);
        }
    }, [initialData]);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">
                {initialData
                    ? "Edit Quick Response"
                    : "Create a New Quick Response"}
            </h2>
            <div className="mb-4">
                <label className="block mb-2">Name the Quick Response</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter the title"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Enter your Quick Response</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="4"
                    placeholder="Enter your quick reply message"
                />
            </div>
            <div className="flex justify-end">
                <Button
                    variant="secondary"
                    className="mr-2"
                    onClick={handleSave}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export default CreateQuickReply;
