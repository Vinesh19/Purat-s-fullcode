import ChatContent from "./ChatContent";
import ChatFooter from "./ChatFooter";
import ChatNavbar from "./ChatNavbar";

const ChatContainer = ({
  user,
  templates,
  selectedChat,
  selectedChatMessages,
  setSelectedChat,
  updateStarredChats,
  updateStatus,
  updateChatMessages,
}) => {
  return (
    <div className="bg-[#ede9e2] h-full flex flex-col">
      <div>
        <ChatNavbar
          user={user}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          updateStarredChats={updateStarredChats}
          updateStatus={updateStatus}
        />
      </div>
      <div className="flex-1">
        <ChatContent messages={selectedChatMessages} />
      </div>
      <div>
        <ChatFooter
          templates={templates}
          user={user?.username}
          selectedChat={selectedChat}
          updateChatMessages={updateChatMessages}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
