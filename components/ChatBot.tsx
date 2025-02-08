"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  sender: "User" | "Bot";
  text: string;
}

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const newMessage: Message = { sender: "User", text: message };
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
      console.log("API Response:", data);

      let botReply = data.reply.trim();
      botReply = botReply.replace(/<think>.*?<\/think>/gs, "").trim();

      if (botReply) {
        setChat((prevChat) => [...prevChat, { sender: "Bot", text: botReply }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setChat((prevChat) => [...prevChat, { sender: "Bot", text: "Sorry, something went wrong." }]);
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
    <div className="flex justify-center items-center h-screen w-screen bg-blue-500">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border border-gray-300 bg-white">
        <CardHeader className="text-center text-2xl font-bold bg-blue-800 text-white py-4 rounded-t-2xl">
          AI Chatbot
        </CardHeader>

        <CardContent className="p-6 flex flex-col h-[70vh]">
          <ScrollArea ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 border rounded-lg bg-gray-50">
            {chat.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 my-2 rounded-lg max-w-lg text-lg shadow-md ${
                  msg.sender === "User" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.text}
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="text-gray-500 text-lg italic mt-2"
              >
                Bot is typing...
              </motion.div>
            )}
          </ScrollArea>

          <div className="mt-4 flex gap-3">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 border p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-lg transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;