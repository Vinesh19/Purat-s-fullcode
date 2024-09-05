import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Add as AddIcon,
  LibraryBooks as LibraryBooksIcon,
} from "@mui/icons-material";

import Modal from "../Modal";
import CreateChatbotModal from "./CreateChatbotModal";

const ChatbotTemplates = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const Header = () => (
    <div className="bg-white p-4 mb-4 shadow-md rounded-lg">
      <div className="container mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
          Chatbot Builder
        </h1>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <Header />
        <div className="flex flex-col gap-6 justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: isLoaded ? 1 : 0,
              y: isLoaded ? 0 : -20,
            }}
            transition={{ duration: 0.5 }}
          >
            <h5 className="text-center text-gray-500 text-lg font-medium">
              Choose how to create a Chatbot
            </h5>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                y: isLoaded ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-full flex flex-col transition-shadow duration-300 hover:shadow-lg rounded-lg bg-[#fafafa] overflow-hidden">
                <div
                  className="pt-[50%] bg-center bg-no-repeat bg-cover relative"
                  style={{
                    backgroundImage:
                      "url(https://via.placeholder.com/300x200.png?text=Create+Chatbot)",
                  }}
                  title="Blank Template"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold mb-2">
                    Start From Scratch
                  </h2>
                  <p className="flex-grow">
                    Create your chatbot from scratch. Submit for review when
                    finished.
                  </p>
                  <button
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-blue-600 transition"
                    onClick={handleModalClick}
                  >
                    <AddIcon className="mr-2" />
                    Create new chatbot
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                y: isLoaded ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="h-full flex flex-col transition-shadow duration-300 hover:shadow-lg rounded-lg bg-[#fafafa] overflow-hidden">
                <div
                  className="pt-[50%] bg-center bg-no-repeat bg-cover relative"
                  style={{
                    backgroundImage:
                      "url(https://via.placeholder.com/300x200.png?text=Prebulid+Chatbots)",
                  }}
                  title="Browse Template"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold mb-2">
                    Browse chatbot library
                  </h2>
                  <p className="flex-grow">
                    Use pre-built chatbots or customize to your needs.
                  </p>
                  <button className="mt-4 bg-purple-500 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-purple-600 transition">
                    <LibraryBooksIcon className="mr-2" />
                    Browse chatbots
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={handleModalClick}
          width="40vw"
          height="50vh"
          className="rounded-lg"
        >
          <CreateChatbotModal />
        </Modal>
      )}
    </>
  );
};

export default ChatbotTemplates;
