import { useEffect, useState, useRef } from "react";
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

import Modal from "../Modal";
import DeleteNode from "./DeleteNoteModal";

import { fetchAgentsName, showUserNotes } from "../../services/api";

const statusMapping = {
    5: "new",
    6: "qualified",
    7: "proposition",
    8: "won",
};

const ChatDetailModal = ({ data, user }) => {
    const [agents, setAgents] = useState([]);
    const [notes, setNotes] = useState(data?.data?.notes || []);
    const [editingIndex, setEditingIndex] = useState(null); // Track which note is being edited
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Manage the delete modal state
    const [noteToDeleteIndex, setNoteToDeleteIndex] = useState(null); // Track which note to delete

    const textFieldRef = useRef(null); // Reference to the current TextField

    const [editData, setEditData] = useState({
        Name: data?.data?.replySourceMessage,
        Number: data?.data?.receiver_id,
        Agent: data?.data?.agent,
        Date: new Date(data?.data?.created_at).toLocaleDateString("en-GB"),
        Time: new Date(data?.data?.created_at).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        Notes: data?.data?.notes || [],
        Tags: data?.data?.tags || [],
        Status: data?.data?.chat_room?.status,
    });

    const fetchAgents = async () => {
        try {
            const payload = {
                action: "read",
                username: user,
            };
            const response = await fetchAgentsName(payload);
            const transformedAgents = response?.data?.data.map((agent) => ({
                id: agent.id,
                name: agent.assign_user,
            }));
            setAgents(transformedAgents);
        } catch (error) {
            console.error("Failed to fetch agents", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };

    const handleDeleteNote = async () => {
        if (noteToDeleteIndex === null) return;

        try {
            const noteToDelete = notes[noteToDeleteIndex];
            const payload = {
                action: "delete",
                id: noteToDelete.id,
            };
            const response = await showUserNotes(payload);
            if (response.data.status === 1) {
                const updatedNotes = notes.filter(
                    (_, i) => i !== noteToDeleteIndex
                );
                setNotes(updatedNotes);
                setEditData({
                    ...editData,
                    Notes: updatedNotes,
                });
            }
            setIsDeleteModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleSaveNote = async (index) => {
        const updatedNotes = [...notes];
        const noteToUpdate = updatedNotes[index];

        try {
            const payload = {
                action: "update",
                id: noteToUpdate.id,
                note: noteToUpdate.note,
                assign_user: "vinesh",
            };
            const response = await showUserNotes(payload);
            if (response.data.status === 1) {
                setNotes(updatedNotes);
                setEditData({
                    ...editData,
                    Notes: updatedNotes,
                });
                setEditingIndex(null); // Exit edit mode
            }
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    const handleNoteChange = (index, value) => {
        const updatedNotes = [...notes];
        updatedNotes[index].note = value;
        setNotes(updatedNotes);
        setEditData({
            ...editData,
            Notes: updatedNotes,
        });
    };

    const handleDeleteTag = (index) => {
        const updatedTags = editData.Tags.filter((_, i) => i !== index);
        setEditData({
            ...editData,
            Tags: updatedTags,
        });
    };

    const handleEditTag = (index, value) => {
        const updatedTags = [...editData.Tags];
        updatedTags[index] = value;
        setEditData({
            ...editData,
            Tags: updatedTags,
        });
    };

    const handleEditNote = (index) => {
        setEditingIndex(index);

        // Delay setting cursor position until after the component updates
        setTimeout(() => {
            if (textFieldRef.current) {
                textFieldRef.current.focus();
                textFieldRef.current.selectionStart =
                    textFieldRef.current.value.length;
                textFieldRef.current.selectionEnd =
                    textFieldRef.current.value.length;
            }
        }, 0);
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-2xl font-semibold mb-4 flex-none">
                User's Information
            </h3>

            <div className="overflow-auto py-2 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                    <TextField
                        label="Name"
                        name="Name"
                        value={editData.Name}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Number"
                        name="Number"
                        value={editData.Number}
                        onChange={handleChange}
                        disabled
                    />

                    <FormControl fullWidth>
                        <InputLabel>Agent</InputLabel>
                        <Select
                            name="Agent"
                            value={editData.Agent}
                            onChange={handleChange}
                        >
                            {!agents.some(
                                (agent) => agent.name === editData.Agent
                            ) && (
                                <MenuItem value={editData.Agent}>
                                    {editData.Agent}
                                </MenuItem>
                            )}
                            {agents.map((agent) => (
                                <MenuItem key={agent.id} value={agent.name}>
                                    {agent.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="Status"
                            value={editData.Status}
                            onChange={handleChange}
                        >
                            {Object.keys(statusMapping).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {statusMapping[key]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Date"
                        name="Date"
                        value={editData.Date}
                        onChange={handleChange}
                        disabled
                    />

                    <TextField
                        label="Time"
                        name="Time"
                        value={editData.Time}
                        onChange={handleChange}
                        disabled
                    />

                    {/* Container for Notes */}
                    <div className="h-44 overflow-y-scroll border border-gray-300 p-2 scrollbar-hide">
                        <h4 className="font-medium">Notes</h4>
                        {notes.length > 0 ? (
                            notes.map((note, index) => (
                                <div
                                    key={index}
                                    className="p-2 mb-2 bg-slate-50 rounded-lg"
                                >
                                    <div className="flex justify-between items-center">
                                        {editingIndex === index ? (
                                            <TextField
                                                inputRef={textFieldRef} // Attach ref to TextField
                                                fullWidth
                                                variant="outlined"
                                                value={note?.note}
                                                onChange={(e) =>
                                                    handleNoteChange(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <p>{note?.note}</p>
                                        )}
                                        <div className="flex">
                                            {editingIndex === index ? (
                                                <IconButton
                                                    onClick={() =>
                                                        handleSaveNote(index)
                                                    }
                                                >
                                                    <CheckIcon className="text-green-600" />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    onClick={() =>
                                                        handleEditNote(index)
                                                    }
                                                >
                                                    <EditIcon className="text-blue-600" />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                onClick={() => {
                                                    setNoteToDeleteIndex(index);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            >
                                                <DeleteIcon className="text-red-600" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No notes available</p>
                        )}
                    </div>

                    {/* Container for Tags */}
                    <div className="h-44 overflow-y-scroll border border-gray-300 p-2 scrollbar-hide">
                        <h4 className="font-medium">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {editData.Tags.length > 0 ? (
                                editData.Tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            className="mr-2"
                                            onClick={() =>
                                                handleEditTag(
                                                    index,
                                                    prompt("Edit Tag:", tag) ||
                                                        tag
                                                )
                                            }
                                        >
                                            {tag?.tag}
                                        </Button>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                handleDeleteTag(index)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                ))
                            ) : (
                                <p>No tags available</p>
                            )}
                        </div>
                    </div>
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
            </div>

            <div className="mt-4 flex-none">
                <Button variant="contained" size="large">
                    Save Changes
                </Button>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isModalOpen={isDeleteModalOpen}
                closeModal={() => setIsDeleteModalOpen(false)}
                width="30vw"
                height="40vh"
                className="rounded-lg"
            >
                <DeleteNode
                    onConfirm={handleDeleteNote}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ChatDetailModal;
