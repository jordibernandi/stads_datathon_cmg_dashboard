"use client"

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ChatBotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [input, setInput] = useState("");

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const response = await fetch("http://localhost:5000/llm_chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: input }),
            });

            const data = await response.json();
            const botMessage = { sender: "bot", text: data.response };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 flex flex-col items-end">
            {isOpen && (
                <Card className="w-80 mb-2 shadow-lg border border-gray-300">
                    <div className="flex justify-between items-center p-3 bg-[#004172] text-white rounded-t-md">
                        <span>Chatbot</span>
                        <X className="cursor-pointer" onClick={toggleChat} />
                    </div>
                    <CardContent className="p-3 h-64 overflow-y-auto space-y-2 bg-white">
                        {messages.map((msg, index) => (
                            <div key={index} className={`p-2 rounded-md ${msg.sender === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"}`}>
                                {msg.text}
                            </div>
                        ))}
                    </CardContent>
                    <div className="p-2 flex items-center border-t">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded-md"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <Button className="ml-2" onClick={sendMessage}>Send</Button>
                    </div>
                </Card>
            )}
            <Button className="rounded-full p-3 bg-[#004172] text-white shadow-lg w-20 h-20 cursor-pointer" onClick={toggleChat}>
                <MessageSquare />
            </Button>
        </div>
    );
};

export default ChatBotWidget;
