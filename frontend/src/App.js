import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  endConversation, // ✅ new import
} from "./api";

function App() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null); // ✅ new state for summary

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await getConversations();
    setConversations(res.data);
  };

  const handleSelect = async (conv) => {
    setSelected(conv);
    setSummary(null); // clear previous summary when switching chats
    const res = await getMessages(conv.id);
    setMessages(res.data.messages || []);
  };

  const handleNewConversation = async () => {
    const title = prompt("Enter chat title:");
    if (!title) return;
    const res = await createConversation(title);
    setConversations([res.data, ...conversations]);
    setSelected(res.data);
    setMessages([]);
    setSummary(null);
  };

  const handleSendMessage = async (content) => {
    if (!selected) return alert("Please select a conversation first!");
    setLoading(true);
    try {
      const res = await sendMessage(selected.id, content);
      setMessages((prev) => [
        ...prev,
        res.data.user_message,
        res.data.ai_message,
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
    setLoading(false);
  };

  // ✅ End chat and get summary
  const handleEndChat = async () => {
    if (!selected) return alert("Select a chat to end!");
    try {
      const res = await endConversation(selected.id);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Error ending chat:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        onSelect={handleSelect}
        onNew={handleNewConversation}
      />

      {/* Main Chat Section */}
      <div className="flex flex-col flex-1">
        {/* Header with End Chat Button */}
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
          <h2 className="font-semibold text-lg">
            {selected ? selected.title : "Select a conversation"}
          </h2>
          {selected && (
            <button
              onClick={handleEndChat}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              End Chat
            </button>
          )}
        </div>

        {/* Chat Window */}
        <ChatWindow messages={messages} />

        {/* ✅ Show Summary if Available */}
        {summary && (
          <div className="bg-yellow-50 border-t p-4 text-gray-800">
            <h3 className="font-semibold mb-2">📝 Chat Summary</h3>
            <p>{summary}</p>
          </div>
        )}

        {/* Message Input */}
        <MessageInput onSend={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}

export default App;
