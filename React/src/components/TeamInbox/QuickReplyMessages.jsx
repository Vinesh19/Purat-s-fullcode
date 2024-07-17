import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import Button from "../Button";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Modal from "../Modal";
import CreateQuickReply from "./CreateQuickReply";

import { ContactList } from "../../services/api";

const QuickReplyMessages = () => {
    const [openCreateQuickReply, setOpenCreateQuickReply] = useState(false);
    const [quickReplies, setQuickReplies] = useState([
        {
            title: "Sample Reply",
            message:
                "This is a sample quick reply message. This is a sample quick reply message. This is a sample quick reply message. This is a sample quick reply message. This is a sample quick reply message.",
        },
    ]);
    const [currentQuickReply, setCurrentQuickReply] = useState(null);

    const handleCreateModal = () => {
        setCurrentQuickReply(null);
        setOpenCreateQuickReply(true);
    };

    const handleEditQuickReply = (reply) => {
        setCurrentQuickReply(reply);
        setOpenCreateQuickReply(true);
    };

    const handleCopyQuickReply = (reply) => {
        setCurrentQuickReply({ ...reply, title: `Copy of ${reply.title}` });
        setOpenCreateQuickReply(true);
    };

    const handleSaveQuickReply = (newReply) => {
        if (currentQuickReply) {
            setQuickReplies(
                quickReplies.map((reply) =>
                    reply.title === currentQuickReply.title ? newReply : reply
                )
            );
        } else {
            setQuickReplies([...quickReplies, newReply]);
        }
        setOpenCreateQuickReply(false);
    };

    const handleDeleteQuickReply = (title) => {
        setQuickReplies(quickReplies.filter((reply) => reply.title !== title));
    };

    return (
        <div>
            <div className="flex items-center gap-28 border-b pb-4">
                <h3 className="text-lg font-semibold">Use a Quick Response</h3>
                <div className="flex gap-5">
                    <Dropdown options={ContactList} placeholder="Most Used" />
                    <Input placeholder="Search" />
                    <Button variant="primary" onClick={handleCreateModal}>
                        Create
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
                {quickReplies.map((reply, index) => (
                    <div
                        key={index}
                        className="border p-3 rounded bg-slate-50 relative"
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-lg">
                                {reply.title}
                            </h4>

                            <div className="flex items-center bg-white rounded">
                                <img
                                    src="/assets/images/svg/copy.svg"
                                    alt="copy"
                                    className="cursor-pointer h-6 mx-2"
                                    onClick={() => handleCopyQuickReply(reply)}
                                />
                                <img
                                    src="/assets/images/svg/edit.svg"
                                    alt="edit"
                                    className="cursor-pointer h-7 border-x px-2"
                                    onClick={() => handleEditQuickReply(reply)}
                                />
                                <FontAwesomeIcon
                                    icon={faTrashCan}
                                    className="cursor-pointer text-slate-600 h-5 m-2"
                                    onClick={() =>
                                        handleDeleteQuickReply(reply.title)
                                    }
                                />
                            </div>
                        </div>

                        <p className="my-4 mr-8">{reply.message}</p>

                        <div className="absolute right-4 bottom-4 bg-gray-100 p-2 rounded-full">
                            <img src="/assets/images/svg/send.svg" alt="send" />
                        </div>
                    </div>
                ))}
            </div>

            {openCreateQuickReply && (
                <Modal
                    isModalOpen={openCreateQuickReply}
                    closeModal={() => setOpenCreateQuickReply(false)}
                    width="60vw"
                    height="60vh"
                    className="rounded-lg top-4"
                >
                    <CreateQuickReply
                        onSave={handleSaveQuickReply}
                        initialData={currentQuickReply}
                    />
                </Modal>
            )}
        </div>
    );
};

export default QuickReplyMessages;
