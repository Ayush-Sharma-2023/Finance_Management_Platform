"use client";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react"; // For icons

const ChatBot = () => {
  const [message, setMessage] = useState("");
  interface Message {
    sender: string;
    text: string;
  }

  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const newMessage = { sender: "User", text: message };
    setChat((prevChat) => [...prevChat, newMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const botMessage = { sender: "Bot", text: data.reply };

      setChat((prevChat) => [...prevChat, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all z-10"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 bg-white border shadow-lg rounded-lg p-4 z-10">
          <h2 className="text-lg font-bold mb-2">Chatbot</h2>
          <div ref={chatContainerRef} className="h-64 overflow-y-auto border p-2 rounded-lg bg-gray-100">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-lg ${
                  msg.sender === "User" ? "bg-blue-200 text-right" : "bg-gray-300 text-left"
                }`}
              >
                <strong>{msg.sender}: </strong>{msg.text}
              </div>
            ))}
          </div>
          <div className="mt-2 flex">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border rounded p-2"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className={`ml-2 px-4 py-2 text-white rounded ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;