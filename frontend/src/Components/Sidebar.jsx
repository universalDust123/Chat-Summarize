import React from "react";

const Sidebar = ({ conversations, onSelect, onNew }) => {
  return (
    <div className="w-1/4 bg-gray-100 h-screen p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">💬 Conversations</h2>
      <button
        className="bg-blue-500 text-white px-3 py-2 rounded mb-4"
        onClick={onNew}
      >
        + New Chat
      </button>
      <div className="space-y-2 overflow-y-auto">
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className="cursor-pointer p-2 bg-white rounded shadow-sm hover:bg-blue-100"
          >
            {c.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
