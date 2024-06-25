import React, { useState } from "react";

const Mobile = ({ data }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const sendMessage = () => {
        if (messageInput.trim() !== "") {
            setMessages([...messages, messageInput]);
            setMessageInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="mobile-ui bg-white rounded-3xl border-[14px] border-white shadow-2xl flex flex-col h-[82vh]">
            <div className="p-2 flex items-center justify-between bg-[#3ea663] rounded-t-lg">
                <div className="flex items-center gap-2">
                    <i className="fas fa-arrow-left text-white text-xl"></i>
                    <i className="fas fa-user-circle text-white text-3xl"></i>
                </div>

                <div className="flex gap-4">
                    <i className="fas fa-video text-white text-lg"></i>
                    <i className="fas fa-phone text-white text-lg"></i>
                    <i className="fas fa-ellipsis-v text-white text-lg"></i>
                </div>
            </div>

            <div id="messages" className="flex-1">
                {data?.message}
            </div>

            <div className="flex items-center p-2 gap-2 bg-gray-300 rounded-b-lg">
                <div className="flex items-center bg-gray-200 rounded-full p-1 gap-2">
                    <i className="far fa-smile text-gray-600 text-lg"></i>

                    <input
                        type="text"
                        id="messageInput"
                        className="flex-grow bg-transparent placeholder-gray-600 outline-none w-36"
                        placeholder="Message"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />

                    <i className="fas fa-paperclip text-gray-600 text-lg rotate-[-45deg]"></i>
                    <i className="fas fa-inr text-gray-600 text-lg"></i>
                    <i className="fas fa-camera text-gray-600 text-lg"></i>
                </div>

                <div
                    className="bg-green-500 cursor-pointer w-8 h-8 rounded-full flex justify-center items-center"
                    onClick={sendMessage}
                >
                    <img
                        src="/assets/images/svg/send-icon.svg"
                        width={16}
                        height={16}
                        alt="send"
                    />
                </div>
            </div>
        </div>
    );
};

export default Mobile;
