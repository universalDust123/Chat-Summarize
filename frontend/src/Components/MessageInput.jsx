import React, { useState } from "react";

const MessageInput = ({ onSend, loading }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="p-4 bg-gray-100 flex">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border rounded p-2 mr-2"
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
};

export default MessageInput;
