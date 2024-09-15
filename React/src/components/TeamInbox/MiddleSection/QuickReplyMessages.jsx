import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../../Button";
import Input from "../../Input";
import Modal from "../../Modal";
import DeleteModal from "./DeleteModal";
import CreateQuickReply from "./CreateQuickReply";

import {
  handleQuickReplies,
  handleQuickRepliesFormData,
} from "../../../services/api";

const QuickReplyMessages = ({ user, onQuickReplySelect }) => {
  const [openCreateQuickReply, setOpenCreateQuickReply] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [filteredQuickReplies, setFilteredQuickReplies] = useState([]);
  const [currentQuickReply, setCurrentQuickReply] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyToDelete, setReplyToDelete] = useState(null);

  const MEDIA_BASE_URL = import.meta.env.VITE_API_MEDIA_URL;

  const fetchQuickReplies = async () => {
    try {
      const response = await handleQuickReplies({
        action: "read",
        username: user,
      });
      setQuickReplies(response?.data?.data);
      setFilteredQuickReplies(response?.data?.data);
    } catch (error) {
      toast.error("Error fetching quick replies:", error);
    }
  };

  const handleSaveQuickReply = async (newReply) => {
    const action =
      currentQuickReply && currentQuickReply.id ? "update" : "create";
    const formData = new FormData();
    formData.append("action", action);
    formData.append("username", user);
    formData.append("heading", newReply.heading);
    formData.append("description", newReply.description);

    // Check if media is defined and append
    if (newReply.media) {
      formData.append("media", newReply.media);
    }

    if (currentQuickReply && currentQuickReply.id) {
      formData.append("id", currentQuickReply.id);
    }

    try {
      const response = await handleQuickRepliesFormData(formData);
      if (response.data.status === 1) {
        toast.success(
          `Quick reply ${
            action === "create" ? "created" : "updated"
          } successfully!`
        );
        fetchQuickReplies();
      } else {
        toast.error(response.data.message || "Failed to save quick reply");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error saving quick reply");
    }
    setOpenCreateQuickReply(false);
  };

  const handleDeleteQuickReply = async (id) => {
    if (!replyToDelete) return;

    try {
      const response = await handleQuickReplies({
        action: "delete",
        id: replyToDelete.id,
        username: user,
      });
      if (response?.data?.status === 1) {
        toast.success("Quick reply deleted successfully!");
        fetchQuickReplies();
        setIsDeleteModalOpen(false);
        setReplyToDelete(null);
      }
    } catch (error) {
      toast.error("Error deleting quick reply:", error);
    }
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm) {
      const filteredReplies = quickReplies.filter(
        (reply) =>
          reply.heading.toLowerCase().includes(searchTerm) ||
          reply.description.toLowerCase().includes(searchTerm)
      );
      setFilteredQuickReplies(filteredReplies);
    } else {
      setFilteredQuickReplies(quickReplies);
    }
  };

  const renderMedia = (media) => {
    if (!media) return null;

    const mediaUrl = `${MEDIA_BASE_URL}${media}`;
    const extension = media.split(".").pop().toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <img src={mediaUrl} alt="Media" className="max-h-32" />;
      case "mp4":
      case "webm":
      case "ogg":
        return <video controls src={mediaUrl} className="max-h-32" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <audio controls src={mediaUrl} className="max-h-32" />;
      case "pdf":
        return (
          <embed src={mediaUrl} type="application/pdf" className="max-h-32" />
        );
      default:
        return <p className="text-center">Cannot preview this file type</p>;
    }
  };

  const handleCreateModal = () => {
    setCurrentQuickReply(null);
    setOpenCreateQuickReply(true);
  };

  const handleEditQuickReply = (reply) => {
    setCurrentQuickReply(reply);
    setOpenCreateQuickReply(true);
  };

  const handleCopyQuickReply = (reply) => {
    setCurrentQuickReply({ ...reply, id: null });
    setOpenCreateQuickReply(true);
  };

  const handleDeleteModal = (reply) => {
    setReplyToDelete(reply);
    setIsDeleteModalOpen(true);
  };

  const handleQuickReplySelectInternal = (reply) => {
    // Corrected to pass the full media URL to the ChatFooter component
    const mediaUrl = reply.media ? `${MEDIA_BASE_URL}${reply.media}` : null;
    onQuickReplySelect(reply.description, mediaUrl);
  };

  useEffect(() => {
    fetchQuickReplies();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-around border-b pb-4">
        <h3 className="text-lg font-semibold">Use a Quick Response</h3>
        <Input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <Button variant="primary" onClick={handleCreateModal}>
          Create
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4 overflow-y-auto scrollbar-hide">
        {filteredQuickReplies.map((reply) => (
          <div
            key={reply.id}
            className="border p-3 rounded bg-slate-50 relative"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold truncate max-w-[70%]">
                {reply.heading}
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
                  onClick={() => handleDeleteModal(reply)}
                />
              </div>
            </div>

            <div className="my-4 mr-8 h-40 overflow-auto scrollbar-hide whitespace-pre-wrap">
              <p>{reply.description}</p>

              {reply.media && (
                <div className="my-4">{renderMedia(reply.media)}</div>
              )}
            </div>

            <div
              className="absolute right-3 bottom-3 bg-gray-200 p-2 rounded-full cursor-pointer"
              onClick={() => handleQuickReplySelectInternal(reply)}
            >
              <img src="/assets/images/svg/send.svg" alt="send" />
            </div>
          </div>
        ))}
      </div>

      {isDeleteModalOpen && (
        <Modal
          isModalOpen={isDeleteModalOpen}
          closeModal={() => setIsDeleteModalOpen(false)}
          width="30%"
          height="40%"
          className=" rounded-xl"
        >
          <DeleteModal
            onConfirm={handleDeleteQuickReply}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </Modal>
      )}

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

      <ToastContainer />
    </div>
  );
};

export default QuickReplyMessages;
