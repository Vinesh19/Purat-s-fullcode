import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import ChatList from "../../components/TeamInbox/ChatList";
import ChatContent from "../../components/TeamInbox/ChatContent";
import UserInfo from "../../components/TeamInbox/UserInfo";

import { templateData, fetchTemplateMessage } from "../../services/api";

const TeamInbox = ({ user }) => {
    const [templates, setTemplates] = useState([]);

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

    useEffect(() => {
        fetchTemplatesAndMessages();
    }, []);

    return (
        <div className="flex">
            <div className="basis-1/4">
                <ChatList templates={templates} />
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
