import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFile,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

import ChatbotTemplates from "../../components/Chatbot/ChatbotTemplates";

const ChatbotBuilder = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("");

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <div className="flex-1 mt-1">
      {/* Sidebar */}
      <aside className="sidebar w-16 md:w-64 bg-white text-indigo-600 rounded-r-xl p-4 shadow-lg fixed h-full overflow-y-auto transition-all duration-300">
        {/* Adjusted position */}
        <nav>
          <ul className="flex flex-col gap-4">
            {[
              { name: "Default Action", icon: faFolder },
              { name: "Keyword Action", icon: faFile },
              { name: "Reply Material", icon: faQuestion },
              { name: "Routing", icon: faFolder },
              { name: "Chatbots", icon: faFile },
              { name: "Sequence", icon: faQuestion },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item.name)}
                  className={`flex flex-col md:flex-row items-center text-blue font-bold p-2 rounded-lg hover:bg-indigo-100 w-full transition duration-300 ${
                    activeMenuItem === item.name ? "bg-blue-100" : ""
                  }`}
                  aria-label={`Go to ${item.name
                    .replace(/([A-Z])/g, " $1")
                    .trim()}`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-6 h-6 md:mr-2"
                  />
                  <span className="hidden md:inline text-sm">
                    {item.name.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="ml-16 md:ml-64">
        <ChatbotTemplates />
      </main>
    </div>
  );
};

export default ChatbotBuilder;
