import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import ChatList from "../../components/TeamInbox/ChatList";
import ChatContent from "../../components/TeamInbox/ChatContent";
import UserInfo from "../../components/TeamInbox/UserInfo";

import {
    templateData,
    fetchTemplateMessage,
    fetchAllChats,
} from "../../services/api";

const TeamInbox = ({ user }) => {
    const [templates, setTemplates] = useState([]);
    const [chats, setChats] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [action, setAction] = useState("active");

    const fetchTemplatesAndMessages = async () => {
        try {
            const response = await templateData({
                username: user.username,
            });

            if (response?.data?.template) {
                const templatesArray = Object.entries(
                    response.data.template
                ).map(([id, name]) => ({ id, name }));

                const templatesWithMessages = await Promise.all(
                    templatesArray.map(async (template) => {
                        try {
                            const messageResponse = await fetchTemplateMessage(
                                template.id
                            );
                            const templateBody =
                                messageResponse?.data?.template
                                    ?.template_body || "No message available";
                            return { ...template, templateBody };
                        } catch (error) {
                            console.error(
                                `Failed to fetch message for template ${template.id}`,
                                error
                            );
                            return {
                                ...template,
                                templateBody: "Failed to fetch message",
                            };
                        }
                    })
                );

                setTemplates(templatesWithMessages);
            } else {
                toast.error("No templates found");
            }
        } catch (error) {
            toast.error("Failed to fetch templates");
            console.error("Failed to fetch templates", error);
        }
    };

    const fetchChats = async (actionType) => {
        try {
            const response = await fetchAllChats({
                action: actionType,
                username: user.username,
            });

            if (response?.data?.data) {
                setChats(response?.data?.data);
                setUnreadCount(response?.data?.unreadCount);
                setTotalCount(response?.data?.totalCount);
            } else {
                toast.error("No chats found");
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
                />
            </div>

            <div className="grow">
                <ChatContent templates={templates} />
            </div>

            <div className="basis-1/4">
                <UserInfo />
            </div>
        </div>
    );
};

export default TeamInbox;
