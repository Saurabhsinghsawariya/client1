"use client";

import { Button } from "@/components/ui/button";
import { Heart, Loader2, Mic, Phone, PhoneOff, Video } from "lucide-react";
import type Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VideoCallProps {
  myId: string;
  partnerId: string;
}

export default function VideoCall({ myId, partnerId }: VideoCallProps) {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState("");

  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<"video" | "audio">("video");

  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);

  /** --------------------------------------
   * DELAYED PEER INIT (Safe)
   * ---------------------------------------*/
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!myId) return;

    let peerInstance: Peer | null = null;
    let timer: NodeJS.Timeout;

    const init = async () => {
      try {
        const { default: Peer } = await import("peerjs");
        const cleanId = String(myId).trim();

        if (!cleanId) return;

        peerInstance = new Peer(cleanId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" },
            ],
          },
        });

        peerInstance.on("open", (id) => {
          setPeerId(id);
          setPeer(peerInstance);
        });

        peerInstance.on("call", (call) => {
          const type = call.metadata?.type || "video";
          setCallType(type);

          setIsIncomingCall(true);
          setIncomingCall(call);
        });

        peerInstance.on("error", (err: any) => {
          if (err.type === "peer-unavailable") {
            toast.error("Your partner is offline 💔");
          }
        });
      } catch (e) {
        console.error("Peer Error:", e);
      }
    };

    timer = setTimeout(init, 1000);

    return () => {
      clearTimeout(timer);
      try {
        peerInstance?.destroy();
      } catch {}
    };
  }, [myId]);

  /** --------------------------------------
   * Get Media Stream
   * ---------------------------------------*/
  const getStream = (type: "video" | "audio") =>
    navigator.mediaDevices.getUserMedia({
      video: type === "video",
      audio: true,
    });

  /** --------------------------------------
   * Answer Incoming Call
   * ---------------------------------------*/
  const answerCall = () => {
    if (!incomingCall) return;

    getStream(callType)
      .then((stream) => {
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        incomingCall.answer(stream);
        setIsIncomingCall(false);
        setIsCallActive(true);

        incomingCall.on("stream", (remoteStream: MediaStream) => {
          if (partnerVideoRef.current)
            partnerVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch(() => toast.error("Microphone or camera blocked 😢"));
  };

  /** --------------------------------------
   * Start Outgoing Call
   * ---------------------------------------*/
  const startCall = (type: "video" | "audio") => {
    if (!peerId || !peer) return toast.error("Connecting… please wait");

    setCallType(type);

    getStream(type)
      .then((stream) => {
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        setIsCallActive(true);

        const call = peer.call(String(partnerId).trim(), stream, {
          metadata: { type },
        });

        if (!call) return toast.error("Call failed");

        call.on("stream", (remoteStream: MediaStream) => {
          if (partnerVideoRef.current)
            partnerVideoRef.current.srcObject = remoteStream;
        });

        call.on("close", endCall);
      })
      .catch(() => toast.error("Permission denied"));
  };

  /** --------------------------------------
   * End Call
   * ---------------------------------------*/
  const endCall = () => {
    const myStream = myVideoRef.current?.srcObject as MediaStream;
    myStream?.getTracks().forEach((t) => t.stop());

    setIsIncomingCall(false);
    setIsCallActive(false);
    window.location.reload();
  };

  /** --------------------------------------
   * ACTIVE CALL UI (Romantic Version)
   * ---------------------------------------*/
  if (isCallActive) {
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-black/90 via-black/75 to-black/90">
        
        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-pink-400 animate-float-soft"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 25 + 12}px`,
                animationDuration: `${Math.random() * 4 + 3}s`,
              }}
            >
              💖
            </span>
          ))}
        </div>

        <div className="relative w-full max-w-4xl aspect-video bg-black/40 backdrop-blur-xl 
          border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

          {/* VIDEO CALL MODE */}
          {callType === "video" ? (
            <>
              <video
                ref={partnerVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Small self preview */}
              <div className="absolute bottom-8 right-8 w-40 aspect-video rounded-xl overflow-hidden border border-white/30 shadow-lg bg-black/50">
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          ) : (
            /* AUDIO CALL MODE */
            <div className="flex flex-col items-center justify-center h-full gap-6 animate-pulse">
              <div className="w-32 h-32 rounded-full bg-pink-600 flex items-center justify-center shadow-pink-500/40 shadow-2xl">
                <Mic className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl text-white font-bold tracking-wide">
                Voice Call Active 🎧
              </h2>
              <video ref={partnerVideoRef} autoPlay className="hidden" />
              <video ref={myVideoRef} autoPlay muted className="hidden" />
            </div>
          )}

          {/* END CALL BUTTON */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <Button
              onClick={endCall}
              className="rounded-full h-20 w-20 bg-red-600 hover:bg-red-700 text-white shadow-2xl hover:scale-110 transition"
            >
              <PhoneOff className="h-8 w-8" />
            </Button>
          </div>
        </div>

        <style>{`
          .animate-float-soft {
            animation: floatSoft 4s ease-in-out infinite;
          }
          @keyframes floatSoft {
            0% { transform: translateY(0px); opacity: 0.7; }
            50% { transform: translateY(-18px); opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  /** --------------------------------------
   * INCOMING CALL POPUP
   * ---------------------------------------*/
  if (isIncomingCall) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-lg border border-pink-200 
        rounded-2xl shadow-xl animate-bounce-soft">

        <Heart className="text-pink-500 w-6 h-6 animate-pulse" />

        <div className="font-medium text-pink-700">
          {callType === "video" ? "📹 Incoming Video Call" : "🎧 Incoming Voice Call"}
        </div>

        <Button
          className="bg-green-600 hover:bg-green-700 rounded-xl"
          onClick={answerCall}
        >
          Answer
        </Button>

        <Button
          variant="ghost"
          className="text-red-600 hover:bg-red-50 rounded-xl"
          onClick={() => setIsIncomingCall(false)}
        >
          Ignore
        </Button>

        <style>{`
          .animate-bounce-soft {
            animation: bounceSoft 1.6s infinite;
          }
          @keyframes bounceSoft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </div>
    );
  }

  /** --------------------------------------
   * IDLE BUTTONS (Default)
   * ---------------------------------------*/
  return (
    <div className="flex items-center gap-2">

      {/* Status light */}
      <div
        className={`w-2 h-2 rounded-full ${
          peerId ? "bg-green-500" : "bg-yellow-400 animate-pulse"
        }`}
        title={peerId ? "Ready" : "Connecting…"}
      />

      {/* Voice Call */}
      <Button
        onClick={() => startCall("audio")}
        disabled={!peerId}
        variant="outline"
        size="icon"
        className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50 shadow-sm"
        title="Voice Call"
      >
        <Phone className="h-4 w-4" />
      </Button>

      {/* Video Call */}
      <Button
        onClick={() => startCall("video")}
        disabled={!peerId}
        variant="outline"
        className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50 shadow-sm flex items-center gap-2"
      >
        {peerId ? (
          <Video className="h-4 w-4" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        <span className="hidden sm:inline">Call</span>
      </Button>
    </div>
  );
}
