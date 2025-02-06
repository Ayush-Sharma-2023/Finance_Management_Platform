"use client";
import { useState, useEffect, useRef } from "react";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

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
    <div className="w-96 mx-auto text-center p-4 border rounded-lg shadow-lg bg-white">
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
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
  );
};

export default ChatBot;
