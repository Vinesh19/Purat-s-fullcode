import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import Dropdown from "../../Dropdown";
import SubmitDropdown from "./SubmitDropdown";

import { favoriteChats, fetchAgentsName } from "../../../services/api";
import { SUBMIT_STATUS } from "../../../services/constant";

const ChatNavbar = ({
    user,
    selectedChat,
    setSelectedChat,
    updateStarredChats,
    updateChatStatus,
}) => {
    const [time, setTime] = useState("");
    const [submitStatus, setSubmitStatus] = useState(null);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const getTime = () => {
        const currentDateTime = new Date();
        const formattedTime = currentDateTime
            .toTimeString()
            .split(" ")[0]
            .slice(0, 5);
        setTime(formattedTime);
    };

    const fetchAgents = async () => {
        try {
            const payload = {
                action: "read",
                username: user.username,
            };
            const response = await fetchAgentsName(payload);
            // Transform the agent data to match the expected format
            const transformedAgents = response?.data?.data.map((agent) => ({
                id: agent.id,
                name: agent.assign_user,
            }));
            setAgents(transformedAgents);
        } catch (error) {
            console.error("Failed to fetch agents", error);
        }
    };

    const handleAgentChange = (e) => {
        const selectedAgentName = e.target.value;
        setSelectedAgent(selectedAgentName);
    };

    const handleSubmitStatusChange = async (status) => {
        setSubmitStatus(status);
        if (selectedChat) {
            const statusValue = [
                "open",
                "expired",
                "pending",
                "solved",
                "spam",
            ].indexOf(status.name.toLowerCase());

            const payload = {
                action: "status",
                receiver_id: selectedChat.receiver_id,
                username: user.username,
                value: statusValue,
            };

            // Call API to update status
            try {
                await favoriteChats(payload);
                // Optionally update the local state to reflect the change
                setSelectedChat({
                    ...selectedChat,
                    chat_room: {
                        ...selectedChat.chat_room,
                        status: status.name,
                    },
                });
                updateChatStatus(selectedChat.chat_room.id, status.name); // Update the chat status in TeamInbox
            } catch (error) {
                console.error("Failed to update status", error);
            }
        }
    };

    const handleStarToggle = useCallback(async () => {
        if (selectedChat) {
            const chatId = selectedChat.chat_room.id;
            const isStarred = selectedChat.chat_room.is_starred === "favorite";
            const newValue = isStarred ? 0 : 1;

            const payload = {
                action: "is_starred",
                receiver_id: selectedChat.receiver_id,
                username: user.username,
                value: newValue,
            };

            try {
                await favoriteChats(payload);
                // Update selectedChat with new star status
                setSelectedChat({
                    ...selectedChat,
                    chat_room: {
                        ...selectedChat.chat_room,
                        is_starred: isStarred ? "none" : "favorite",
                    },
                });
                updateStarredChats(chatId, !isStarred);
            } catch (error) {
                console.error("Failed to update star status", error);
            }
        }
    }, [selectedChat, updateStarredChats]);

    useEffect(() => {
        getTime();
        const interval = setInterval(getTime, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchAgents();
    }, [user.username]);

    return (
        <div className="flex items-center justify-between bg-white shadow-lg m-1 px-8 py-4 rounded-sm">
            <div className="text-green-600 font-semibold border-2 rounded-full inline p-2 bg-slate-50">
                {time}
            </div>

            <div className="flex gap-8">
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <span className="text-green-600 text-xl font-bold bg-slate-100 px-3.5 py-1.5 rounded-full">
                            {(selectedAgent
                                ? selectedAgent.charAt(0)
                                : "B"
                            ).toUpperCase()}
                        </span>
                        <span className="absolute right-2 bottom-9 text-8xl leading-3 w-2 h-2 text-green-500">
                            .
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold">
                            {selectedAgent || "Bot"}
                        </span>
                        <span className="text-sm">Available</span>
                    </div>
                </div>

                <div>
                    <Dropdown
                        options={agents}
                        value={selectedAgent || ""}
                        onChange={handleAgentChange}
                        placeholder="Select User"
                        className="font-semibold bg-slate-50 border-none hover:border-green-500 w-60"
                        valueKey="name" // Explicitly set valueKey to "name"
                    />
                </div>
            </div>

            <span className="py-1 px-2 rounded text-lg text-slate-400 bg-slate-50 cursor-pointer">
                <FontAwesomeIcon
                    icon={faStar}
                    onClick={handleStarToggle}
                    className={
                        selectedChat?.chat_room?.is_starred === "favorite"
                            ? "text-amber-300"
                            : "text-slate-400"
                    }
                />
            </span>

            <div>
                <SubmitDropdown
                    options={SUBMIT_STATUS}
                    value={submitStatus}
                    onChange={handleSubmitStatusChange}
                    placeholder="Submit As"
                />
            </div>
        </div>
    );
};

export default ChatNavbar;
