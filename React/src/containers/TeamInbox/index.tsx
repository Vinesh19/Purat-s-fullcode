import ChatList from "../../components/ChatList";
import ChatContent from "../../components/ChatContent";

const TeamInbox = () => {
    return (
        <div className="flex">
            <div className="basis-1/4">
                <ChatList />
            </div>
            <div className="grow">
                <ChatContent />
            </div>
            <div></div>
        </div>
    );
};

export default TeamInbox;
