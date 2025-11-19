"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { useCouple } from "@/hooks/useCouple";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export default function RealtimeData() {
  const socket = useSocket();
  const { user } = useCouple();
  const queryClient = useQueryClient();

  /* --------------------------------------------------
     Stable listeners (avoid re-registration)
  -------------------------------------------------- */

  const handleRefreshMemories = useCallback(() => {
    console.log("📸 New Photo Detected → Refreshing memories...");
    queryClient.invalidateQueries({ queryKey: ["memories"] });
  }, [queryClient]);

  const handleRefreshDiary = useCallback(() => {
    console.log("📔 New Diary Entry → Refreshing diary...");
    queryClient.invalidateQueries({ queryKey: ["diary"] });
  }, [queryClient]);

  /* --------------------------------------------------
     Attach socket listeners safely
  -------------------------------------------------- */
  useEffect(() => {
    if (!socket) return;
    if (!user?.coupleId?._id) return;

    const roomId = String(user.coupleId._id);

    console.log("🔗 Joining updates room:", roomId);
    socket.emit("joinRoom", roomId);

    socket.on("refreshMemories", handleRefreshMemories);
    socket.on("refreshDiary", handleRefreshDiary);

    return () => {
      console.log("❌ Cleaning up realtime listeners...");
      socket.off("refreshMemories", handleRefreshMemories);
      socket.off("refreshDiary", handleRefreshDiary);
    };
  }, [socket, user?.coupleId?._id, handleRefreshMemories, handleRefreshDiary]);

  return null;
}
