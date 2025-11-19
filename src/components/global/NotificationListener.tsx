"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { useCouple } from "@/hooks/useCouple";
import { useSound } from "@/hooks/useSound";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function NotificationListener() {
  const socket = useSocket();
  const { user } = useCouple();
  const { play } = useSound("/sounds/notification.mp3");
  const pathname = usePathname();

  /* --------------------------------------------------
     🛡️ Safe message handler (prevents re-renders)
  -------------------------------------------------- */
  const handleNewMessage = useCallback(
    (message: any) => {
      if (!message || !user?._id) return;

      const senderId = String(message.senderId?._id || message.senderId);
      const myId = String(user._id);

      console.log("----- Incoming Message -----");
      console.log("Sender:", senderId);
      console.log("Me:", myId);

      const isMine = senderId === myId;
      console.log("Mine?", isMine ? "YES → No sound" : "NO → Play sound");

      if (isMine) return;

      try {
        play(); // Safe sound play
      } catch (err) {
        console.warn("Sound play failed:", err);
      }

      if (pathname !== "/dashboard") {
        toast.message("New Message 💌", { description: message.content });
      }
    },
    [user, play, pathname]
  );

  /* --------------------------------------------------
     🛡️ Join room safely
  -------------------------------------------------- */
  useEffect(() => {
    if (!socket) return;
    if (!user?.coupleId?._id) return;

    const roomId = String(user.coupleId._id);

    console.log("🔗 Joining room:", roomId);
    socket.emit("joinRoom", roomId);

    socket.on("newMessage", handleNewMessage);

    return () => {
      console.log("❌ Removing message listener");
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, user?.coupleId?._id, handleNewMessage]);

  return null;
}
