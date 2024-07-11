import ChatFooter from "./ChatFooter";
import ChatNavbar from "./ChatNavbar";

const ChatContent = () => {
    return (
        <div className="bg-slate-50 h-full flex flex-col">
            <div><ChatNavbar /></div>
            <div className=" flex-1"></div>
            <div><ChatFooter /></div>
        </div>
    );
};

export default ChatContent;
