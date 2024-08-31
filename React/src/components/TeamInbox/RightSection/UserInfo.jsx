import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faCheck,
    faTimes,
    faTrashCan,
    faPen,
} from "@fortawesome/free-solid-svg-icons";

import Modal from "../../Modal";
import CustomParameter from "./CustomParameter";

import { fetchUserNotes, fetchUserTags } from "../../../services/api";

const formatDateTime = (dateTimeString) => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
};

const UserInfo = ({ Contact, Name, user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customParameters, setCustomParameters] = useState([
        { key: "Language", value: "en" },
        { key: "Name", value: "Yash Sharma" },
    ]);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [editNoteIndex, setEditNoteIndex] = useState(null);

    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [editTagIndex, setEditTagIndex] = useState(null);
    const [initialLetter, setInitialLetter] = useState("B"); // Default initial letter

    const fetchNotes = async () => {
        try {
            const payload = {
                action: "read",
                username: user,
                receiver_id: Contact,
            };
            const response = await fetchUserNotes(payload);
            if (response.data.status === 1) {
                setNotes(response?.data?.data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const fetchTags = async () => {
        try {
            const payload = {
                action: "read",
                username: user,
                receiver_id: Contact,
            };
            const response = await fetchUserTags(payload);
            if (response?.data?.status === 1) {
                setTags(response?.data?.data);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const handleSaveNote = async () => {
        if (newNote.trim()) {
            try {
                if (isEditingNote && editNoteIndex !== null) {
                    const noteToUpdate = notes[editNoteIndex];
                    const payload = {
                        action: "update",
                        id: noteToUpdate.id,
                        note: newNote,
                        assign_user: "vinesh",
                    };
                    const response = await fetchUserNotes(payload);
                    if (response.data.status === 1) {
                        const updatedNotes = notes.map((note, index) =>
                            index === editNoteIndex
                                ? { ...note, note: newNote }
                                : note
                        );
                        setNotes(updatedNotes);
                        setIsEditingNote(false);
                        setEditNoteIndex(null);
                    }
                } else {
                    const payload = {
                        action: "create",
                        username: user,
                        receiver_id: Contact,
                        note: newNote,
                        assign_user: "vinesh",
                    };
                    const response = await fetchUserNotes(payload);
                    if (response.data.status === 1) {
                        fetchNotes();
                    }
                }
                setNewNote("");
                setIsAddingNote(false);
            } catch (error) {
                console.error("Error saving note:", error);
            }
        }
    };

    const handleDeleteNote = async (index) => {
        try {
            const noteToDelete = notes[index];
            const payload = {
                action: "delete",
                id: noteToDelete.id,
            };
            const response = await fetchUserNotes(payload);
            if (response.data.status === 1) {
                const updatedNotes = notes.filter((_, i) => i !== index);
                setNotes(updatedNotes);
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleEditNote = (index) => {
        setNewNote(notes[index].note);
        setIsAddingNote(true);
        setIsEditingNote(true);
        setEditNoteIndex(index);
    };

    const handleCancelNote = () => {
        setNewNote("");
        setIsAddingNote(false);
        setIsEditingNote(false);
        setEditNoteIndex(null);
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveAttributes = (attributes) => {
        setCustomParameters(attributes);
        closeModal();
    };

    const handleAddNoteClick = () => {
        setIsAddingNote(true);
    };

    const handleNoteChange = (e) => {
        setNewNote(e.target.value);
    };

    const handleSaveTag = async () => {
        if (newTag.trim()) {
            try {
                if (isEditingTag && editTagIndex !== null) {
                    const tagToUpdate = tags[editTagIndex];
                    const payload = {
                        action: "update",
                        id: tagToUpdate.id,
                        tag: newTag,
                        assign_user: "vinesh",
                    };
                    const response = await fetchUserTags(payload);
                    if (response?.data?.status === 1) {
                        const updatedTags = tags.map((tag, index) =>
                            index === editTagIndex
                                ? { ...tag, tag: newTag }
                                : tag
                        );
                        setTags(updatedTags);
                        setIsEditingTag(false);
                        setEditTagIndex(null);
                    }
                } else {
                    const payload = {
                        action: "create",
                        username: user,
                        receiver_id: Contact,
                        tag: newTag,
                        assign_user: "vinesh",
                    };
                    const response = await fetchUserTags(payload);
                    if (response?.data?.status === 1) {
                        fetchTags();
                    }
                }
                setNewTag("");
                setIsAddingTag(false);
            } catch (error) {
                console.error("Error saving tag:", error);
            }
        }
    };

    const handleDeleteTag = async (index) => {
        try {
            const tagToDelete = tags[index];
            const payload = {
                action: "delete",
                id: tagToDelete.id,
            };
            const response = await fetchUserTags(payload);
            if (response?.data?.status === 1) {
                const updatedTags = tags.filter((_, i) => i !== index);
                setNotes(updatedTags);
            }
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    const handleEditTag = (index) => {
        setNewTag(tags[index].tag);
        setIsAddingTag(true);
        setIsEditingTag(true);
        setEditTagIndex(index);
    };

    const handleCancelTag = () => {
        setNewTag("");
        setIsAddingTag(false);
        setIsEditingTag(false);
        setEditTagIndex(null);
    };

    const handleAddTagClick = () => {
        setIsAddingTag(true);
    };

    const handleTagChange = (e) => {
        setNewTag(e.target.value);
    };

    useEffect(() => {
        if (Contact) {
            fetchNotes();
            fetchTags();
        }
    }, [Contact]);

    useEffect(() => {
        if (Name) {
            setInitialLetter(Name.charAt(0).toUpperCase());
        } else {
            setInitialLetter("B");
        }
    }, [Name]);

    return (
        <div className="px-4 py-4">
            <div className="flex justify-between items-center border-b pb-5">
                <div className="flex gap-4 items-center">
                    <div className="relative -z-10 z">
                        <span className="text-green-600 text-2xl font-bold bg-slate-100 px-5 py-3 rounded-full">
                            {initialLetter} {/* Display the initial letter */}
                        </span>
                        <span className="absolute right-1 bottom-8 text-8xl leading-3 w-3 h-3 text-green-500">
                            .
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold text-xl w-40 truncate">
                            {Name}
                        </span>
                        <span>Available</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <img
                        src="/assets/images/svg/whatsapp.svg"
                        alt="WhatsApp Icon"
                        className="w-10 h-10 outline outline-1 outline-slate-400 rounded-lg p-2"
                    />
                    <img
                        src="/assets/images/svg/chat.svg"
                        alt="SMS Icon"
                        className="w-10 h-10 outline outline-1 outline-slate-400 rounded-lg p-2"
                    />
                </div>
            </div>

            <div className="scrollbar-hide h-[80vh] overflow-y-auto">
                <div className="py-4">
                    <h3 className="font-semibold text-lg">Basic Information</h3>
                    <p className="flex items-center gap-2">
                        Phone number : {Contact}
                        <span>
                            <img
                                src="/assets/images/svg/Indian-flag.svg"
                                alt="India's flag"
                                className="w-6"
                            />
                        </span>
                    </p>
                </div>

                <div className="border-y py-2">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Contact custom parameters</h4>
                        <img
                            src="/assets/images/svg/pen.svg"
                            alt="pen"
                            onClick={handleModal}
                            className="bg-green-600 p-1 w-8 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div className="my-6">
                        <table className="min-w-full border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-r">
                                        Parameter
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customParameters.map((param, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b border-r">
                                            {param.key}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {param.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div
                    className={`flex flex-col ${
                        tags.length === 0 ? "min-h-[20vh]" : "h-[40vh]"
                    }`}
                >
                    <div className="flex justify-between items-center py-2">
                        <h4 className="font-bold">Tags</h4>
                        <h4
                            className="bg-green-600 p-2 text-lg text-white font-semibold flex justify-center items-center rounded-md cursor-pointer"
                            onClick={handleAddTagClick}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </h4>
                    </div>

                    <div className="overflow-auto flex-1 scrollbar-hide">
                        {isAddingTag && (
                            <div className="border p-4 rounded-md">
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    rows="3"
                                    value={newTag}
                                    onChange={handleTagChange}
                                    placeholder="Add your tag here..."
                                ></textarea>

                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        className="text-red-600 border border-red-600 text-lg py-1 px-2 rounded-md"
                                        onClick={handleCancelTag}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>

                                    <button
                                        className="text-green-600 border border-green-600 text-lg py-1 px-2 rounded-md"
                                        onClick={handleSaveTag}
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="py-2">
                            {tags.length === 0 ? (
                                <p className="text-gray-500 text-center mt-4">
                                    No tags available
                                </p>
                            ) : (
                                tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="p-2 mb-2 border border-blue-100 rounded-lg"
                                    >
                                        <div className="flex justify-between items-center">
                                            <p>{tag.tag}</p>

                                            <div className="flex">
                                                <FontAwesomeIcon
                                                    icon={faPen}
                                                    className="text-blue-600 p-2 rounded-lg cursor-pointer"
                                                    onClick={() =>
                                                        handleEditTag(index)
                                                    }
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                    className="text-red-600 p-2 rounded-lg cursor-pointer"
                                                    onClick={() =>
                                                        handleDeleteTag(index)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`flex flex-col ${
                        notes.length === 0 ? "min-h-[20vh]" : "h-[50vh]"
                    }`}
                >
                    <div className="flex justify-between items-center py-2">
                        <h4 className="font-bold">Notes</h4>
                        <h4
                            className="bg-green-600 p-2 text-lg text-white font-semibold flex justify-center items-center rounded-md cursor-pointer"
                            onClick={handleAddNoteClick}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </h4>
                    </div>

                    <div className="overflow-auto flex-1 scrollbar-hide">
                        {isAddingNote && (
                            <div className="my-4 border p-4 rounded-md">
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    rows="3"
                                    value={newNote}
                                    onChange={handleNoteChange}
                                    placeholder="Add your note here..."
                                ></textarea>

                                <div className="flex justify-end gap-2 mt-2">
                                    <button
                                        className="text-red-600 border border-red-600 text-lg py-1 px-2 rounded-md"
                                        onClick={handleCancelNote}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>

                                    <button
                                        className="text-green-600 border border-green-600 text-lg py-1 px-2 rounded-md"
                                        onClick={handleSaveNote}
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="my-4">
                            {notes.length === 0 ? (
                                <p className="text-gray-500 text-center mt-4">
                                    No notes available
                                </p>
                            ) : (
                                notes.map((note, index) => (
                                    <div
                                        key={index}
                                        className="p-4 mb-2 bg-slate-50 rounded-lg"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src="/assets/images/svg/user-profile.svg"
                                                    alt="user"
                                                    className="w-10 h-10"
                                                />
                                                <div>
                                                    <h3 className="font-bold">
                                                        {note.assign_user}
                                                    </h3>

                                                    <span className="text-gray-600 text-sm">
                                                        {formatDateTime(
                                                            note?.updated_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <FontAwesomeIcon
                                                    icon={faPen}
                                                    className="text-blue-600 p-2 rounded-lg cursor-pointer"
                                                    onClick={() =>
                                                        handleEditNote(index)
                                                    }
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                    className="text-red-600 p-2 rounded-lg cursor-pointer"
                                                    onClick={() =>
                                                        handleDeleteNote(index)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <p className="mt-2">{note.note}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    width="40vw"
                    height="60vh"
                    className="rounded-lg shadow-2xl"
                >
                    <CustomParameter
                        onSave={handleSaveAttributes}
                        params={customParameters}
                    />
                </Modal>
            )}
        </div>
    );
};

export default UserInfo;
