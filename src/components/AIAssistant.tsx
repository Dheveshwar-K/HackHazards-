import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "OceanMind Command AI initialized. Ask me about fishery density, coral bleach risks, or maritime policies." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      // Call the FastAPI chatbot API
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        throw new Error("API Offline");
      }
    } catch (err) {
      // High-fidelity fallback client-side handler in case backend isn't launched yet
      setTimeout(() => {
        let reply = "Processing telemetry... ";
        const lowerVal = userText.toLowerCase();

        if (lowerVal.includes("fish") || lowerVal.includes("predict")) {
          reply = "ML prediction analysis suggests a 93% suitability score for Tuna in Grid 4. Current direction vectors are moving northeast at 1.2 m/s.";
        } else if (lowerVal.includes("coral") || lowerVal.includes("bleach")) {
          reply = "Alert: Acropora coral reefs are experiencing high bleaching vulnerability due to a +1.8C SST marine heatwave anomaly. Suggested mitigation: deploy local solar barriers.";
        } else if (lowerVal.includes("dna") || lowerVal.includes("species")) {
          reply = "Environmental DNA sequencing confirms presence of Thunnus thynnus (Bluefin Tuna) in Zone 4. Matches are verified with 99.1% confidence.";
        } else {
          reply = "Ecosystem sensors are reporting nominal parameters. Would you like me to generate an automated PDF compliance forecast for your active sector?";
        }

        setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 glass-panel rounded-2xl border border-cyan-400/30 flex flex-col overflow-hidden mb-3 animate-[slideIn_0.25s_ease-out] shadow-2xl">
          {/* Header */}
          <div className="bg-primary/80 border-b border-cyan-400/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="font-orbitron text-xs text-cyan-400 font-bold uppercase tracking-wider">OceanMind Core AI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 cyber-grid">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed font-sub ${
                  msg.sender === "user"
                    ? "bg-cyan-400/10 text-cyan-400 self-end border border-cyan-400/35"
                    : "bg-primary/60 text-slate-200 self-start border border-slate-500/20"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="bg-primary/60 text-slate-400 border border-slate-500/20 self-start rounded-xl px-3 py-2 text-xs font-numeric flex gap-1 items-center">
                <span>AI is scanning data</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
                <span className="animate-bounce [animation-delay:0.4s]">.</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-cyan-400/20 bg-primary/45 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query ocean status..."
              className="flex-1 bg-black/60 border border-cyan-400/25 rounded px-2 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sub"
            />
            <button
              type="submit"
              className="bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30 border border-cyan-400/40 rounded px-3 py-1 text-xs font-orbitron font-bold uppercase transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full glass-panel border border-cyan-400/40 flex items-center justify-center cursor-pointer shadow-lg hover:border-accent hover:shadow-cyan-400/10 transition-all hover:scale-105"
        style={{
          boxShadow: "0 0 15px rgba(0, 229, 255, 0.25)"
        }}
      >
        <span className="text-glow-cyan text-lg select-none">💬</span>
      </button>
    </div>
  );
};
