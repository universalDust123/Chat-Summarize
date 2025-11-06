export default function MessageBubble({ sender, content }) {
  const isUser = sender === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-md text-sm leading-relaxed
        ${isUser ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"}`}
      >
        {content}
      </div>
    </div>
  );
}
