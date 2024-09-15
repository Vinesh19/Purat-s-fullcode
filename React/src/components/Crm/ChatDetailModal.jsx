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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import Modal from "../Modal";
import DeleteConfirmation from "./DeleteModal";

import {
  fetchAgentsName,
  fetchUserNotes,
  fetchUserTags,
  fetchCrmSpecificChat,
} from "../../services/api";

const statusMapping = {
  5: "new",
  6: "qualified",
  7: "proposition",
  8: "won",
};

const ChatDetailModal = ({ data, user }) => {
  const [agents, setAgents] = useState([]);
  const [notes, setNotes] = useState(data?.data?.notes || []);
  const [tags, setTags] = useState(data?.data?.tags || []); // Separate state for tags
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newNote, setNewNote] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState(null); // Determine if deleting note or tag
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null); // Track which item to delete
  const [editData, setEditData] = useState({
    Name: data?.data?.replySourceMessage,
    Number: data?.data?.receiver_id,
    Agent: data?.data?.agent,
    Date: new Date(data?.data?.created_at).toLocaleDateString("en-GB"),
    Time: new Date(data?.data?.created_at).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    Status: data?.data?.chat_room?.status,
  });

  const tagFieldRef = useRef(null);

  const fetchAgents = async () => {
    try {
      const payload = {
        action: "read",
        username: user,
      };
      const response = await fetchAgentsName(payload);
      const transformedAgents = response?.data?.data.map((agent) => ({
        id: agent?.id,
        name: agent?.assign_user,
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

  const handleCreateNote = async () => {
    try {
      const payload = {
        action: "create",
        username: user,
        receiver_id: editData?.Number,
        note: newNote,
        assign_user: "vinesh",
      };
      const response = await fetchUserNotes(payload);
      if (response?.data?.status === 1) {
        setNotes([...notes, response?.data?.data]); // Assuming API returns the created note
        setNewNote(""); // Clear the input field
        setIsAddingNote(false); // Hide the input field
      }
    } catch (error) {
      console.error("Error creating note:", error);
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
        assign_user: user,
      };
      const response = await fetchUserNotes(payload);
      if (response.data.status === 1) {
        setNotes(updatedNotes);
        setEditingIndex(null);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async () => {
    if (itemToDeleteIndex === null) return;

    try {
      const noteToDelete = notes[itemToDeleteIndex];
      const payload = {
        action: "delete",
        id: noteToDelete.id,
      };
      const response = await fetchUserNotes(payload);
      if (response?.data?.status === 1) {
        const updatedNotes = notes.filter((_, i) => i !== itemToDeleteIndex);
        setNotes(updatedNotes);
      }
      setIsDeleteModalOpen(false);
      setItemToDeleteIndex(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index].note = value;
    setNotes(updatedNotes);
  };

  const handleEditNote = (index) => {
    setEditingIndex(index);
  };

  const handleCreateTag = async () => {
    try {
      const payload = {
        action: "create",
        username: user,
        receiver_id: editData?.Number,
        tag: newTag,
        assign_user: "vinesh",
      };
      const response = await fetchUserTags(payload);
      if (response?.data?.status === 1) {
        setTags([...tags, response?.data?.data]); // Assuming API returns the created tag
        setNewTag(""); // Clear the input field
        setIsAddingTag(false); // Hide the input field
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleSaveTag = async (index) => {
    const updatedTags = [...tags]; // Use the tags state directly
    const tagToUpdate = updatedTags[index];

    try {
      const payload = {
        action: "update",
        id: tagToUpdate.id,
        tag: tagToUpdate.tag,
        assign_user: user,
      };
      const response = await fetchUserTags(payload);
      if (response?.data?.status) {
        setTags(updatedTags);
        setEditingTagIndex(null); // Exit edit mode and revert to button
      }
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const handleDeleteTag = async () => {
    if (itemToDeleteIndex === null) return;

    try {
      const tagToDelete = tags[itemToDeleteIndex];
      const payload = {
        action: "delete",
        id: tagToDelete.id,
      };
      const response = await fetchUserTags(payload);
      if (response.data.status === 1) {
        const updatedTags = tags.filter((_, i) => i !== itemToDeleteIndex);
        setTags(updatedTags);
      }
      setIsDeleteModalOpen(false);
      setItemToDeleteIndex(null);
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const handleTagChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index].tag = value;
    setTags(updatedTags);
  };

  const handleEditTag = (index) => {
    setEditingTagIndex(index);

    setTimeout(() => {
      if (tagFieldRef.current) {
        tagFieldRef.current.focus();
        const length = tagFieldRef.current.value.length;
        tagFieldRef.current.setSelectionRange(length, length);
      }
    }, 0);
  };

  const handleDelete = (type, index) => {
    setDeleteItemType(type);
    setItemToDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      const payload = {
        action: "update",
        receiver_id: editData.Number,
        username: user,
        status: editData.Status,
        name: editData.Name,
        assign_user: editData.Agent,
        internal_note: editData.internalNotes,
      };

      const response = await fetchCrmSpecificChat(payload);
      if (response?.data?.status === 1) {
        console.log("CRM specific chat updated successfully.");
        // You might want to update the state or trigger any other action here
      }
    } catch (error) {
      console.error("Error updating CRM specific chat:", error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-2xl font-semibold mb-4 flex-none">
        User's Information
      </h3>

      <div className="overflow-auto py-2 mb-12 scrollbar-hide">
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
            <Select name="Agent" value={editData.Agent} onChange={handleChange}>
              {!agents.some((agent) => agent.name === editData.Agent) && (
                <MenuItem value={editData.Agent}>{editData.Agent}</MenuItem>
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
            <h4 className="font-medium flex items-center justify-between">
              Notes{" "}
              <IconButton
                onClick={() => setIsAddingNote(true)}
                className="ml-2"
              >
                <AddIcon />
              </IconButton>
            </h4>
            {isAddingNote && (
              <div className="p-2 mb-2 bg-slate-50 rounded-lg flex items-center">
                <TextField
                  fullWidth
                  variant="outlined"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter new note"
                />
                <IconButton onClick={handleCreateNote} className="ml-2">
                  <CheckIcon className="text-green-600" />
                </IconButton>
                <IconButton
                  onClick={() => setIsAddingNote(false)}
                  className="ml-2"
                >
                  <CloseIcon className="text-red-600" />
                </IconButton>
              </div>
            )}
            {notes?.length > 0 ? (
              notes?.map((note, index) => (
                <div key={index} className="pl-2 mb-2 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    {editingIndex === index ? (
                      <TextField
                        inputRef={tagFieldRef}
                        fullWidth
                        variant="outlined"
                        value={note?.note}
                        onChange={(e) =>
                          handleNoteChange(index, e.target.value)
                        }
                      />
                    ) : (
                      <p>{note?.note}</p>
                    )}
                    <div className="flex">
                      {editingIndex === index ? (
                        <IconButton onClick={() => handleSaveNote(index)}>
                          <CheckIcon className="text-green-600" />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => handleEditNote(index)}>
                          <EditIcon className="text-blue-600" />
                        </IconButton>
                      )}
                      <IconButton onClick={() => handleDelete("note", index)}>
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
            <h4 className="font-medium flex items-center justify-between">
              Tags{" "}
              <IconButton onClick={() => setIsAddingTag(true)} className="ml-2">
                <AddIcon />
              </IconButton>
            </h4>
            <div className="flex flex-wrap gap-2">
              {isAddingTag && (
                <div className="flex items-center w-full">
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter new tag"
                  />
                  <IconButton onClick={handleCreateTag} className="ml-2">
                    <CheckIcon className="text-green-600" />
                  </IconButton>
                  <IconButton
                    onClick={() => setIsAddingTag(false)}
                    className="ml-2"
                  >
                    <CloseIcon className="text-red-600" />
                  </IconButton>
                </div>
              )}
              {tags?.length > 0 ? (
                tags?.map((tag, index) => (
                  <div key={index} className="flex items-center w-full">
                    {editingTagIndex === index ? (
                      <>
                        <TextField
                          inputRef={tagFieldRef} // Use ref to control cursor
                          fullWidth
                          variant="outlined"
                          value={tag?.tag}
                          onChange={(e) =>
                            handleTagChange(index, e.target.value)
                          }
                          style={{
                            marginRight: "8px",
                          }}
                        />
                        <IconButton onClick={() => handleSaveTag(index)}>
                          <CheckIcon className="text-green-600" />
                        </IconButton>
                      </>
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        style={{
                          marginRight: "8px",
                          flex: "1",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {tag?.tag}
                        <div className="flex">
                          <IconButton
                            size="small"
                            onClick={() => handleEditTag(index)}
                          >
                            <EditIcon className="text-blue-600" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete("tag", index)}
                          >
                            <DeleteIcon className="text-red-600" />
                          </IconButton>
                        </div>
                      </Button>
                    )}
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

      <div className="flex-none absolute bottom-4 right-4">
        <Button variant="contained" size="large" onClick={handleSaveChanges}>
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
        <DeleteConfirmation
          onConfirm={
            deleteItemType === "note" ? handleDeleteNote : handleDeleteTag
          }
          onCancel={() => setIsDeleteModalOpen(false)}
          itemType={deleteItemType} // Pass the type to the modal
        />
      </Modal>
    </div>
  );
};

export default ChatDetailModal;
