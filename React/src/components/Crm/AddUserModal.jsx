import { useState, useEffect } from "react";
import {
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

import {
    fetchAgentsName,
    fetchCrmSpecificChat,
    fetchCrmChats,
} from "../../services/api";

const statusMapping = {
    5: "new",
    6: "qualified",
    7: "proposition",
    8: "won",
};

const AddUser = ({ user, closeModal, fetchData }) => {
    const [agents, setAgents] = useState([]);
    const [status, setStatus] = useState("");
    const [selectedAgent, setSelectedAgent] = useState("");
    const [tags, setTags] = useState([]);
    const [notes, setNotes] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [noteInput, setNoteInput] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [name, setName] = useState("");
    const [internalNote, setInternalNote] = useState("");

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

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleAgentChange = (e) => {
        setSelectedAgent(e.target.value);
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleNoteInputChange = (e) => {
        setNoteInput(e.target.value);
    };

    const addTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput(""); // Clear the input field after adding the tag
        }
    };

    const addNote = () => {
        if (noteInput) {
            setNotes([...notes, noteInput]);
            setNoteInput(""); // Clear the input field after adding the note
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const removeTag = (index) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const removeNote = (index) => {
        const newNotes = [...notes];
        newNotes.splice(index, 1);
        setNotes(newNotes);
    };

    const handleAddUser = async () => {
        const payload = {
            action: "create",
            source: "CRM",
            receiver_id: receiverId,
            username: user,
            name: name,
            status: status,
            internal_note: internalNote,
            assign_user: selectedAgent,
            notes: notes.map((note) => ({
                note,
            })),
            tags: tags.map((tag) => ({
                tag,
            })),
        };

        try {
            await fetchCrmSpecificChat(payload);
            await fetchData();
            closeModal();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-2xl font-semibold mb-4 flex-none">
                Enter User's Detail
            </h3>

            <div className="overflow-auto py-2 mb-12 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                    <TextField
                        label="Name"
                        name="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        label="Number"
                        name="Number"
                        onChange={(e) => setReceiverId(e.target.value)}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Agent</InputLabel>
                        <Select
                            name="Agent"
                            value={selectedAgent}
                            onChange={handleAgentChange}
                        >
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
                            value={status}
                            onChange={handleStatusChange}
                        >
                            {Object.keys(statusMapping).map((key) => (
                                <MenuItem key={key} value={key}>
                                    {statusMapping[key]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Container for Notes */}
                    <div className="h-44 overflow-y-scroll border border-gray-300 p-2 scrollbar-hide">
                        <h4 className="font-medium mb-2">Notes</h4>
                        <div className="flex flex-col gap-2">
                            {notes.map((note, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-start border border-gray-300 p-2 rounded"
                                >
                                    <p className="flex-grow">{note}</p>
                                    <IconButton
                                        size="small"
                                        onClick={() => removeNote(index)}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                        <TextField
                            label="Add a Note"
                            value={noteInput}
                            onChange={handleNoteInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                        />
                        <Button
                            onClick={addNote}
                            variant="contained"
                            size="small"
                        >
                            Add Note
                        </Button>
                    </div>

                    {/* Container for Tags */}
                    <div className="h-44 overflow-y-scroll border border-gray-300 p-2 scrollbar-hide">
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <div key={index} className="flex items-center">
                                    <Button variant="outlined" size="small">
                                        {tag}
                                        <CloseIcon
                                            fontSize="small"
                                            className="ml-1"
                                            onClick={() => removeTag(index)}
                                        />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <TextField
                            label="Add a Tag"
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleKeyDown}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            onClick={addTag}
                            variant="contained"
                            size="small"
                        >
                            Add Tag
                        </Button>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="font-medium">Internal Notes</h3>
                    <textarea
                        className="w-full p-2 border rounded"
                        name="internalNotes"
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        rows={5}
                    />
                </div>
            </div>

            <div className="absolute bottom-4 right-4">
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleAddUser}
                >
                    Add User
                </Button>
            </div>
        </div>
    );
};

export default AddUser;
