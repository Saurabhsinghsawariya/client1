"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Already initialized → prevent duplicate sockets
    if (socketRef.current) return;

    const apiURL =
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      "https://server-1s0l.onrender.com";

    try {
      console.log("🔌 Connecting to Socket.io:", apiURL);

      const newSocket = io(apiURL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 800,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      /* --------------------------------------------------
         ❤️ Listen: Heart Animation Event
      -------------------------------------------------- */
      const showHeartHandler = () => {
        if (typeof window !== "undefined") {
          // @ts-ignore
          if (window.triggerHeart) {
            try {
              // @ts-ignore
              window.triggerHeart();
            } catch (err) {
              console.warn("Heart animation failed:", err);
            }
          }
        }
      };

      newSocket.on("showHeart", showHeartHandler);

      /* --------------------------------------------------
         Cleanup
      -------------------------------------------------- */
      return () => {
        console.log("❌ Disconnecting socket...");
        newSocket.off("showHeart", showHeartHandler);
        newSocket.disconnect();
        socketRef.current = null;
      };
    } catch (err) {
      console.error("Socket connection error:", err);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
