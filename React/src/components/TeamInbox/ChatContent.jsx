import ChatFooter from "./ChatFooter";
import ChatNavbar from "./ChatNavbar";

const ChatContent = ({ templates }) => {
    return (
        <div className="bg-slate-50 h-full flex flex-col">
            <div>
                <ChatNavbar />
            </div>
            <div className=" flex-1"></div>
            <div>
                <ChatFooter templates={templates} />
            </div>
        </div>
    );
};

export default ChatContent;
