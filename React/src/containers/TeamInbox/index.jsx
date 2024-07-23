import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import ChatList from "../../components/TeamInbox/LeftSection/ChatList";
import ChatContainer from "../../components/TeamInbox/MiddleSection/ChatContainer";
import UserInfo from "../../components/TeamInbox/RightSection/UserInfo";

import { templateData, fetchAllChats } from "../../services/api";

const TeamInbox = ({ user }) => {
    const [templates, setTemplates] = useState([]);
    const [chats, setChats] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [action, setAction] = useState("active");
    const [contacts, setContacts] = useState([]);

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

    useEffect(() => {
        fetchTemplatesAndMessages();
    }, []);

    useEffect(() => {
        fetchChats(action);
    }, [action]);

    return (
        <div className="flex">
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
                />
            </div>

            <div className="grow">
                <ChatContainer templates={templates} />
            </div>

            <div className="basis-1/4">
                <UserInfo />
            </div>
        </div>
    );
};

export default TeamInbox;
