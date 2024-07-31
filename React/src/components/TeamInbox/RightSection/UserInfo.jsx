import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faCheck,
    faTimes,
    faTrashCan,
    faPen,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../../Input";
import Modal from "../../Modal";
import CustomParameter from "./CustomParameter";
import { showUserNotes } from "../../../services/api";

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
    const [initialLetter, setInitialLetter] = useState("B"); // Default initial letter

    const fetchNotes = async () => {
        try {
            const payload = {
                action: "read",
                username: user,
                receiver_id: Contact,
            };
            const response = await showUserNotes(payload);
            console.log("notes", response);
            if (response.data.status === 1) {
                setNotes(response?.data?.data);
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
                        assign_user: noteToUpdate.assign_user,
                    };
                    const response = await showUserNotes(payload);
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
                    const response = await showUserNotes(payload);
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
            const response = await showUserNotes(payload);
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

    useEffect(() => {
        if (Contact) {
            fetchNotes();
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
                        <span className="font-bold text-xl">{Name}</span>
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
                <div className="my-6">
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

                <div className="border-y py-4 my-4">
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

                <div className="border-b pb-8">
                    <h4 className="font-bold">Tags</h4>
                    <div className="relative mt-2">
                        <img
                            src="/assets/images/svg/tag.svg"
                            alt="tag"
                            className="absolute left-2 top-4"
                        />
                        <Input className="w-full" />
                    </div>
                </div>

                <div className="my-4 h-[50vh] flex flex-col">
                    <div className="flex justify-between items-center my-4">
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
                            {notes.map((note, index) => (
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
                            ))}
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
