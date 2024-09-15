import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

import "../TeamInbox.css";

const ChatContent = ({ messages }) => {
  const chatContainerRef = useRef(null);
  const MEDIA_BASE_URL = import.meta.env.VITE_API_MEDIA_URL;

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const date = formatDate(message.created_at);
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const renderMedia = (media) => {
    const mediaUrl = `${MEDIA_BASE_URL}${media}`;
    const mediaType = media.split(".").pop().toLowerCase();

    switch (mediaType) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <img src={mediaUrl} alt="Media" className="max-w-full" />;
      case "mp4":
      case "webm":
      case "ogg":
        return <video src={mediaUrl} controls className="max-w-full" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <audio src={mediaUrl} controls className="max-w-full" />;
      case "pdf":
        return <iframe src={mediaUrl} title="PDF" className="max-w-full" />;
      default:
        return (
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faFileAlt}
              className="text-gray-500 text-4xl mr-4"
            />
            <span className="mr-4 w-40 truncate font-semibold">{media}</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={chatContainerRef}
      className="chat-container overflow-y-scroll scrollbar-hide h-[calc(100vh-220px)]"
    >
      {Object.keys(groupedMessages).map((date, dateIndex) => (
        <React.Fragment key={dateIndex}>
          <div className="chat-date">{date}</div>
          {groupedMessages[date].map((message, index) => {
            const isSentByUser = message.eventtype === "broadcastMessage";
            const messageClass = classNames("message-bubble", {
              "message-sent": isSentByUser,
              "message-received": !isSentByUser,
            });

            return (
              <div key={index} className={messageClass}>
                <span className="absolute -left-20 bottom-4 text-slate-400 text-xs font-semibold">
                  {message.eventDescription}
                </span>

                <div className="message-content">
                  {message.media && (
                    <div className="message-media mb-2">
                      {renderMedia(message.media)}
                    </div>
                  )}
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {formatTime(message.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ChatContent;
