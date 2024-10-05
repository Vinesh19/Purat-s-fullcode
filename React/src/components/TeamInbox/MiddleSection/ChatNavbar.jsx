import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { CircularProgress, Typography, Box } from "@mui/material";

import Dropdown from "../../Dropdown";
import SubmitDropdown from "./SubmitDropdown";

import { fetchAgentsName, updateChatStatus } from "../../../services/api";
import { SUBMIT_STATUS } from "../../../services/constant";

const ChatNavbar = ({
  user,
  selectedChat,
  setSelectedChat,
  updateStarredChats,
  updateStatus,
  updateChatAgent,
  timer,
}) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [remainingMinutes, setRemainingMinutes] = useState(1440);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [agents, setAgents] = useState([]);
  const [name, setName] = useState("User");
  const [selectedAgent, setSelectedAgent] = useState(null);

  const getRemainingTime = (timer) => {
    // Convert the provided time (ISO 8601 format) to a Date object
    let lastMessageTime = new Date(timer);

    // Adjust the lastMessageTime by subtracting the time zone offset (GMT+0530 = 330 minutes)
    const timeZoneOffset = 330; // Offset for GMT+0530 in minutes
    lastMessageTime = new Date(
      lastMessageTime.getTime() - timeZoneOffset * 60 * 1000
    );

    // Get the current time (in UTC)
    const currentTime = new Date();

    // Calculate the expiration time, which is exactly 24 hours after the lastMessageTime
    const expirationTime = new Date(
      lastMessageTime.getTime() + 24 * 60 * 60 * 1000
    );

    // Check if the current time is past the expiration time
    if (currentTime >= expirationTime) {
      return { formattedTime: "00:00", remainingMinutes: 0 };
    }

    // If chat is not expired, calculate the remaining time until expiration
    const timeDifferenceMs = expirationTime - currentTime; // Difference in milliseconds
    const remainingMinutes = Math.floor(timeDifferenceMs / (1000 * 60)); // Remaining minutes

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60; // Remaining hours

    // Format the remaining time as HH:MM
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return { formattedTime, remainingMinutes };
  };

  const getProgressColor = () => {
    if (remainingMinutes < 180) return "error"; // Red for <3 hours
    if (remainingMinutes < 480) return "warning"; // Yellow for <8 hours
    return "success"; // Green for 8-24 hours
  };

  const getProgressValue = () => {
    return (remainingMinutes / 1440) * 100; // 1440 minutes in 24 hours
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

  const handleAgentChange = async (e) => {
    const selectedAgentName = e.target.value;
    setSelectedAgent(selectedAgentName);

    // Find the selected agent object based on the agent name
    const agent = agents.find((a) => a.name === selectedAgentName);

    // Proceed if an agent is selected and a chat is available
    if (agent && selectedChat) {
      const payload = {
        action: "assign_to",
        receiver_id: selectedChat.receiver_id,
        username: user.username,
        value: agent.id,
      };

      try {
        await updateChatStatus(payload);
        setSelectedChat({
          ...selectedChat,
          chat_room: {
            ...selectedChat.chat_room,
            assign_user: {
              ...selectedChat.chat_room.assign_user,
              assign_user: agent.name,
            },
          },
        });
        updateChatAgent(selectedChat.chat_room.id, agent.name);
      } catch (error) {
        console.error("Failed to update agent assignment", error);
      }
    }
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
        "new",
        "qualified",
        "proposition",
        "Won",
      ].indexOf(status.name.toLowerCase());

      const payload = {
        action: "status",
        receiver_id: selectedChat.receiver_id,
        username: user.username,
        value: statusValue,
      };

      // Call API to update status
      try {
        await updateChatStatus(payload);
        // Optionally update the local state to reflect the change
        setSelectedChat({
          ...selectedChat,
          chat_room: {
            ...selectedChat.chat_room,
            status: status.name,
          },
        });
        updateStatus(selectedChat.chat_room.id, status.name); // Update the chat status in TeamInbox
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
        await updateChatStatus(payload);
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
    const intervalId = setInterval(() => {
      const { formattedTime, remainingMinutes } = getRemainingTime(timer);
      setRemainingTime(formattedTime);
      setRemainingMinutes(remainingMinutes);
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [timer]);

  useEffect(() => {
    if (selectedChat?.chat_room?.assign_user) {
      setSelectedAgent(selectedChat.chat_room.assign_user.assign_user);
    } else {
      setSelectedAgent(null);
    }

    if (selectedChat) {
      setName(selectedChat?.replySourceMessage);
    } else {
      setName("User");
    }
  }, [selectedChat]);

  useEffect(() => {
    fetchAgents();
  }, [user.username]);

  useEffect(() => {
    if (selectedChat) {
      const chatStatus = SUBMIT_STATUS.find(
        (status) =>
          status.name.toLowerCase() ===
          selectedChat.chat_room.status.toLowerCase()
      );
      setSubmitStatus(chatStatus || null); // Set status or null if not found
    }
  }, [selectedChat]);

  return (
    <div className="flex items-center justify-between bg-white shadow-lg m-1 p-4 rounded-sm">
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          value={100}
          size={48}
          thickness={2.5}
          sx={{
            color: "#f8d7da", // Light red background color for expired timer
            position: "absolute",
          }}
        />

        <CircularProgress
          variant="determinate"
          value={getProgressValue()}
          color={getProgressColor()} // Dynamically change the color based on remaining hours
          size={48} // Size of the progress bar
          thickness={2.5} // Thickness of the progress bar
        />

        {/* <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `rotate(${360 * getProgressValue()}deg) translate(22px)`,
            transformOrigin: "center left",
            width: "8px",
            height: "8px",
            backgroundColor: getProgressColor() === "error" ? "red" : "green",
            borderRadius: "50%",
          }}
        /> */}

        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="caption"
            component="div"
            color={getProgressColor() === "error" ? "error" : "textPrimary"}
            fontSize="14px"
            paddingTop="2px"
          >
            {remainingTime}
            {/* Show remaining time inside the circular progress */}
          </Typography>
        </Box>
      </Box>

      <div className="flex gap-3">
        <div className="flex gap-2 items-center w-40">
          <div className="relative">
            <span className="text-green-600 text-xl font-bold bg-slate-100 px-3.5 py-1.5 rounded-full">
              {(selectedChat
                ? selectedChat?.replySourceMessage.charAt(0)
                : "U"
              ).toUpperCase()}
            </span>
            <span className="absolute right-2 bottom-9 text-8xl leading-3 w-2 h-2 text-green-500">
              .
            </span>
          </div>

          <div className="flex flex-col truncate">
            <span className="font-bold truncate">{name}</span>
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
