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
import { fetchAgentsName } from "../../services/api";
import { Close as CloseIcon } from "@mui/icons-material";

const statusMapping = {
    5: "new",
    6: "qualified",
    7: "proposition",
    8: "won",
};

const AddUser = ({ user }) => {
    const [agents, setAgents] = useState([]);
    const [tags, setTags] = useState([]);
    const [notes, setNotes] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [noteInput, setNoteInput] = useState("");

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

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-2xl font-semibold mb-4 flex-none">
                Enter User's Detail
            </h3>

            <div className="overflow-auto mb-14 scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                    <TextField label="Name" name="Name" />

                    <TextField label="Number" name="Number" />

                    <FormControl fullWidth>
                        <InputLabel>Agent</InputLabel>
                        <Select name="Agent">
                            {agents.map((agent) => (
                                <MenuItem key={agent.id} value={agent.name}>
                                    {agent.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select name="Status">
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
                        rows={5}
                    />
                </div>
            </div>

            <div className="absolute bottom-4 right-4">
                <Button variant="contained" size="large">
                    Add User
                </Button>
            </div>
        </div>
    );
};

export default AddUser;
