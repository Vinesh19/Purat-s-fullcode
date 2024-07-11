import ChatList from "../../components/TeamInbox/ChatList";
import ChatContent from "../../components/TeamInbox/ChatContent";
import UserInfo from "../../components/TeamInbox/UserInfo";

const TeamInbox = ({ user }) => {
    return (
        <div className="flex">
            <div className="basis-1/4">
                <ChatList user={user} />
            </div>
            <div className="grow">
                <ChatContent />
            </div>
            <div className="basis-1/4">
                <UserInfo />
            </div>
        </div>
    );
};

export default TeamInbox;
