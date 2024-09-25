import React, { useEffect, useRef } from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

import "../TeamInbox.css";

const ChatContent = ({ messages }) => {
  const chatContainerRef = useRef(null);

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
      timeZone: "UTC",
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
    const mediaUrl = `${media}`;
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
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-lg font-semibold">
            No user selected
          </p>
        </div>
      ) : (
        Object.keys(groupedMessages).map((date, dateIndex) => (
          <React.Fragment key={dateIndex}>
            <div className="chat-date">{date}</div>
            {groupedMessages[date].map((message, index) => {
              const isSentByUser = message.eventtype === "broadcastMessage";

              const agentName = message?.agent || "Bot Replied";

              const messageClass = classNames("message-bubble", {
                "message-sent": isSentByUser,
                "message-received": !isSentByUser,
              });

              const mediaToRender = message.media || message.template_media;

              return (
                <div key={index} className="message-container">
                  {/* Align agent name next to message bubble */}
                  <div
                    className={classNames("message-row", {
                      "message-row-sent": isSentByUser,
                    })}
                  >
                    {isSentByUser && (
                      <span className="agent-name">{agentName}</span>
                    )}

                    {/* Message bubble */}
                    <div className={messageClass}>
                      <div className="message-content">
                        {(message.media || message.template_media) && (
                          <div className="message-media mb-2">
                            {renderMedia(mediaToRender)}
                          </div>
                        )}
                        <div className="message-text">{message.text}</div>
                        <div className="message-time">
                          {formatTime(message.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default ChatContent;
