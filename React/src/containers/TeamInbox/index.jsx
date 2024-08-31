import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import ChatList from "../../components/TeamInbox/LeftSection/ChatList";
import ChatContainer from "../../components/TeamInbox/MiddleSection/ChatContainer";
import UserInfo from "../../components/TeamInbox/RightSection/UserInfo";

import {
    templateData,
    fetchAllChats,
    fetchSelectedChatData,
} from "../../services/api";

const TeamInbox = ({ user }) => {
    const [templates, setTemplates] = useState([]);
    const [chats, setChats] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [action, setAction] = useState("active");
    const [contacts, setContacts] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedChatMessages, setSelectedChatMessages] = useState([]);
    const [starredChats, setStarredChats] = useState({});

    const fetchTemplatesAndMessages = async () => {
        const response = await templateData({
            username: user.username,
            action: "read",
        });

        setTemplates(response?.data?.template || []);
    };

    const fetchChats = async (actionType) => {
        try {
            const response = await fetchAllChats({
                action: actionType,
                username: user?.username,
            });

            if (response?.data?.data) {
                if (actionType === "contacts") {
                    setContacts(response?.data?.data);
                } else {
                    setChats(response?.data?.data);
                    setUnreadCount(response?.data?.total_unread);
                    setTotalCount(response?.data?.total_count);
                }
            } else {
                toast.error("No data found");
            }
        } catch (error) {
            toast.error("Failed to fetch chats");
            console.error("Failed to fetch chats", error);
        }
    };

    const fetchChatMessages = async (receiver_id) => {
        try {
            const response = await fetchSelectedChatData({
                action: "read",
                receiver_id,
                username: user?.username,
            });
            setSelectedChatMessages(response?.data?.data);
        } catch (error) {
            toast.error("Failed to fetch chat messages");
            console.error("Failed to fetch chat messages", error);
        }
    };

    const handleChatSelection = (chat) => {
        setSelectedChat(chat);
        fetchChatMessages(chat.chat_room.receiver_id);
    };

    const updateStarredChats = (chatId, isStarred) => {
        setStarredChats((prevStarredChats) => ({
            ...prevStarredChats,
            [chatId]: isStarred,
        }));

        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.chat_room.id === chatId
                    ? {
                          ...chat,
                          chat_room: {
                              ...chat.chat_room,
                              is_starred: isStarred ? "favorite" : "none",
                          },
                      }
                    : chat
            )
        );
    };

    const updateChatStatus = (chatId, status) => {
        console.log("status", chatId);
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.chat_room.id === chatId
                    ? {
                          ...chat,
                          chat_room: { ...chat.chat_room, status },
                      }
                    : chat
            )
        );
    };

    const updateChatMessages = (newMessages) => {
        setSelectedChatMessages((prevMessages) => [
            ...prevMessages,
            newMessages,
        ]);
    };

    useEffect(() => {
        fetchTemplatesAndMessages();
    }, []);

    useEffect(() => {
        fetchChats(action);
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
        <div className="flex grow">
            <div className="basis-1/4">
                <ChatList
                    templates={templates}
                    chats={chats}
                    unreadCount={unreadCount}
                    totalCount={totalCount}
                    action={action}
                    setAction={setAction}
                    user={user}
                    contacts={contacts}
                    setSelectedChat={handleChatSelection}
                    starredChats={starredChats}
                    updateStarredChats={updateStarredChats}
                    updateChatMessages={updateChatMessages}
                />
            </div>

            <div className=" basis-1/2">
                <ChatContainer
                    templates={templates}
                    selectedChat={selectedChat}
                    selectedChatMessages={selectedChatMessages}
                    user={user}
                    setSelectedChat={setSelectedChat}
                    updateStarredChats={updateStarredChats}
                    updateChatStatus={updateChatStatus}
                    updateChatMessages={updateChatMessages}
                />
            </div>

            <div className="basis-1/4">
                <UserInfo
                    Contact={selectedChat?.chat_room?.receiver_id || ""}
                    Name={selectedChat?.replySourceMessage || ""}
                    user={user?.username}
                />
            </div>
        </div>
    );
};

export default TeamInbox;
