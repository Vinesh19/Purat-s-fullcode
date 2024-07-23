import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faFilter,
    faPlus,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

import Dropdown from "../../Dropdown";
import Modal from "../../Modal";
import AdvanceFilter from "./AdvanceFilter";
import ContactTemplate from "../LeftSection/ContactTemplate";

import { favoriteChats } from "../../../services/api";
import { CHATS_TYPE } from "../../../services/constant";
import "../TeamInbox.css";

const ChatList = ({
    templates,
    chats,
    unreadCount,
    totalCount,
    action,
    setAction,
    user,
    contacts,
    onSelectChat,
}) => {
    const [selectedChat, setSelectedChat] = useState(action);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showContactTemplate, setShowContactTemplate] = useState(false);
    const [hoveredChat, setHoveredChat] = useState(null);
    const [starredChats, setStarredChats] = useState({});

    const handleChatSelection = (e) => {
        const selectedValue = e.target.value;
        const selectedChatType = CHATS_TYPE.find(
            (type) => type.name === selectedValue
        );

        setSelectedChat(selectedChatType.name);
        setAction(selectedChatType.action);
        setShowContactTemplate(false);
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleContactTemplate = () => {
        setShowContactTemplate(!showContactTemplate);
        if (!showContactTemplate) {
            setAction("contacts");
        }
    };

    const filteredChats = chats.filter(
        (chat) =>
            chat?.replySourceMessage
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            chat?.text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strMinutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${strMinutes} ${ampm}`;
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case "expired":
                return "bg-red-100 text-red-700";
            case "open":
                return "bg-green-100 text-green-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "solved":
                return "bg-blue-100 text-blue-700";
            case "spam":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const handleStarToggle = useCallback(
        async (chat) => {
            const chatId = chat.chat_room.id;
            const isStarred = !!starredChats[chatId];
            const newValue = isStarred ? 0 : 1;

            const payload = {
                action: "is_starred",
                receiver_id: chat.receiver_id,
                username: user.username,
                value: newValue,
            };

            try {
                await favoriteChats(payload);
                setStarredChats((prevStarredChats) => ({
                    ...prevStarredChats,
                    [chatId]: !isStarred,
                }));
            } catch (error) {
                console.error("Failed to update star status", error);
            }
        },
        [starredChats]
    );

    useEffect(() => {
        const initialChatType = CHATS_TYPE.find(
            (type) => type.action === action
        );
        setSelectedChat(
            initialChatType ? initialChatType.name : CHATS_TYPE[0].name
        );
    }, [action]);

    useEffect(() => {
        const initialStarredChats = chats.reduce((acc, chat) => {
            if (chat?.chat_room?.is_starred === "favorite") {
                acc[chat.chat_room.id] = true;
            }
            return acc;
        }, {});
        setStarredChats(initialStarredChats);
    }, [chats]);

    return (
        <div className="p-6">
            <div>
                <div className="flex bg-slate-50 text-slate-400 rounded">
                    <div className="bg-slate-50 flex justify-center items-center gap-2 px-2 py-0.5 border-r rounded-l">
                        <FontAwesomeIcon
                            icon={faSearch}
                            size="xs"
                            className="text-slate-400 mt-1"
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-slate-50 outline-none"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="flex justify-center items-center">
                        <select
                            className="bg-slate-50 outline-none"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Messages
                            </option>
                            <option value="All">All</option>
                            <option value="Name or Phone">Name or Phone</option>
                            <option value="Messages">Messages</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2 mb-4 border-b pb-4">
                    <div className="flex flex-col">
                        <Dropdown
                            options={CHATS_TYPE}
                            value={selectedChat}
                            onChange={handleChatSelection}
                            placeholder="All Chats"
                            className="border-none font-medium text-xl pl-0"
                        />
                        <span className="text-xs font-medium text-slate-400">
                            {`${totalCount} Chats  ${unreadCount} Unread`}
                        </span>
                    </div>

                    <div className="flex gap-5">
                        <FontAwesomeIcon
                            icon={faFilter}
                            onClick={handleModal}
                            className="border-8 rounded-full bg-slate-200 text-slate-600 h-5 cursor-pointer hover:outline hover:outline-lime-600"
                        />

                        <FontAwesomeIcon
                            icon={faPlus}
                            onClick={toggleContactTemplate}
                            className="border-8 rounded-full bg-slate-200 text-slate-600  h-5 cursor-pointer hover:text-lime-600"
                        />
                    </div>
                </div>
            </div>

            <div className="h-[calc(100vh-200px)] overflow-y-scroll scrollbar-hide">
                {showContactTemplate ? (
                    <ContactTemplate
                        templates={templates}
                        setShowContactTemplate={setShowContactTemplate}
                        contacts={contacts}
                    />
                ) : filteredChats?.length > 0 ? (
                    filteredChats?.map((chat) => (
                        <div
                            key={chat?.chat_room?.id}
                            className="border-b py-4 hover:bg-[#fdfdfd] cursor-pointer px-2 my-1"
                            onMouseEnter={() =>
                                setHoveredChat(chat.chat_room.id)
                            }
                            onMouseLeave={() => setHoveredChat(null)}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold">
                                    {chat?.replySourceMessage}
                                </h3>
                                <FontAwesomeIcon
                                    icon={faStar}
                                    onClick={() => handleStarToggle(chat)}
                                    className={
                                        starredChats[chat.chat_room.id]
                                            ? "text-amber-300 cursor-pointer"
                                            : hoveredChat === chat.chat_room.id
                                            ? "text-slate-100 cursor-pointer"
                                            : "hidden"
                                    }
                                />
                            </div>

                            <div className="my-1 truncate-multiline">
                                {chat?.text}
                            </div>

                            <div className="flex justify-between text-xs">
                                <p
                                    className={`px-2 py-1 rounded font-medium ${getStatusClass(
                                        chat?.chat_room?.status
                                    )}`}
                                >
                                    {chat?.chat_room?.status}
                                </p>
                                <p>{formatTime(chat?.created_at)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No messages found.</p>
                )}
            </div>

            {isModalOpen && (
                <Modal
                    isModalOpen={isModalOpen}
                    closeModal={handleModal}
                    width="50vw"
                    height="60vh"
                >
                    <AdvanceFilter closeModal={handleModal} user={user} />
                </Modal>
            )}
        </div>
    );
};

export default ChatList;
