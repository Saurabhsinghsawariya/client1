"use client";
import { useSocket } from "@/components/providers/SocketProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatWindowProps {
  user: any;
}

export default function ChatWindow({ user }: ChatWindowProps) {
  const socket = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ----------------------------------------- */
  /*   FIXED: SAFE CHECK FOR coupleId EXIST     */
  /* ----------------------------------------- */

  const coupleId = user?.coupleId?._id;

  // If no coupleId yet, show loader UI
  if (!coupleId) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500 text-sm">
        Connecting your LoveSpace...
      </div>
    );
  }

  /* ----------------------------------------- */
  /*   FETCH CHAT HISTORY SAFELY               */
  /* ----------------------------------------- */

  const { data: history } = useQuery({
    queryKey: ["chat", coupleId],
    queryFn: async () => {
      const res = await api.get(`/api/chat/${coupleId}`);
      return res.data;
    },
    enabled: !!coupleId, // prevents error
  });

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  /* ----------------------------------------- */
  /*   SOCKET LISTENERS                        */
  /* ----------------------------------------- */
  useEffect(() => {
    if (!socket || !coupleId) return;

    socket.emit("joinRoom", coupleId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, coupleId]);

  /* ----------------------------------------- */
  /*   AUTO SCROLL                             */
  /* ----------------------------------------- */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ----------------------------------------- */
  /*   SEND MESSAGE                            */
  /* ----------------------------------------- */
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      coupleId,
      senderId: user._id,
      content: newMessage,
    });

    setNewMessage("");
  };

  /* ----------------------------------------- */
  /*   HEART SEND LOGIC                        */
  /* ----------------------------------------- */
  const sendHeart = () => {
    if (!socket) return;

    socket.emit("sendHeart", coupleId);

    if (typeof window !== "undefined" && (window as any).triggerHeart) {
      (window as any).triggerHeart();
    }
  };

  /* ----------------------------------------- */
  /*   UI                                      */
  /* ----------------------------------------- */

  return (
    <div className="relative flex h-[80vh] flex-col justify-between p-4 rounded-3xl 
      bg-gradient-to-br from-pink-100 via-white to-purple-100 shadow-xl overflow-hidden">

      {/* Floating romantic background hearts */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute text-pink-300 animate-float-soft"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              fontSize: `${Math.random() * 22 + 12}px`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          >
            {i % 2 === 0 ? "💖" : "✨"}
          </span>
        ))}
      </div>

      {/* Chat Messages */}
      <Card className="relative flex-1 overflow-hidden bg-white/60 backdrop-blur-xl 
        rounded-2xl border border-white/40 shadow-inner p-4 mb-4">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-4 flex flex-col">
            {messages.map((msg, i) => {
              const isMe =
                msg.senderId._id === user._id || msg.senderId === user._id;

              return (
                <div
                  key={i}
                  className={`flex transition-all duration-300 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[75%] px-4 py-2 text-sm shadow-md rounded-2xl 
                      animate-messagePop
                      ${
                        isMe
                          ? "bg-pink-600 text-white rounded-tr-sm"
                          : "bg-white text-gray-900 border border-pink-100 rounded-tl-sm"
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* Input Controls */}
      <form
        onSubmit={handleSend}
        className="relative flex gap-2 items-center bg-white/70 backdrop-blur-xl 
        p-3 rounded-xl border border-white/40 shadow-md"
      >
        {/* Heart Button */}
        <Button
          type="button"
          onClick={sendHeart}
          className="bg-white border border-pink-200 hover:bg-pink-50 shadow-sm rounded-xl"
        >
          <Heart className="text-pink-600 h-5 w-5" fill="currentColor" />
        </Button>

        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write something sweet..."
          className="flex-1 rounded-xl border-pink-300 focus-visible:ring-pink-400 bg-white/80"
        />

        <Button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 rounded-xl shadow-md"
        >
          Send 💌
        </Button>
      </form>

      {/* Animations */}
      <style>{`
        .animate-float-soft {
          animation: floatSoft 4.5s ease-in-out infinite;
        }
        @keyframes floatSoft {
          0% { transform: translateY(0px); opacity: .6; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(0px); opacity: .6; }
        }

        .animate-messagePop {
          animation: msgPop .25s ease-out;
        }
        @keyframes msgPop {
          from { transform: scale(.9); opacity: 0.3; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
