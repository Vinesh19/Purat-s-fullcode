import { useState } from "react";
import Input from "../Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip, faSmile } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";

const ChatFooter = () => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");

    const onEmojiClick = (event) => {
        console.log(event);
        setMessage((prevMessage) => prevMessage + event.emoji);
        setShowEmojiPicker(false);
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <div className="flex justify-between bg-white shadow-2xl mx-1 mb-4 px-8 py-4 rounded-sm">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Type a message here."
                    value={message}
                    onChange={handleInputChange}
                    noBorder={true}
                    autoFocus={true}
                    className="w-96"
                />
            </div>

            <div className="flex gap-4 items-center relative">
                <FontAwesomeIcon
                    icon={faSmile}
                    className="text-gray-400 text-xl cursor-pointer"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <FontAwesomeIcon
                    icon={faPaperclip}
                    className="text-gray-400 text-xl rotate-[-45deg]"
                />
                <button className="border px-10 py-2 rounded bg-green-500 text-white">
                    Send
                </button>

                {showEmojiPicker && (
                    <div className="absolute bottom-14">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatFooter;
