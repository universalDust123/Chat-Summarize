import React, { useEffect, useRef } from "react";

const ChatWindow = ({ messages }) => {
  const endRef = useRef(null);

  // Scroll to the latest message when messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to format timestamps like "2:35 PM"
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex-1 bg-white p-4 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`my-2 p-3 rounded-xl max-w-xl shadow-sm transition-all duration-200 ${
            msg.sender === "user"
              ? "bg-blue-100 ml-auto text-right"
              : "bg-gray-200 mr-auto text-left"
          }`}
        >
          <p className="text-gray-800">{msg.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatTime(msg.timestamp)}
          </p>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default ChatWindow;
