"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCouple } from "@/hooks/useCouple";
import { useSound } from "@/hooks/useSound";

import {
  BookHeart,
  Heart,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Volume2,
  VolumeX,
} from "lucide-react";

import FloatingHearts from "@/components/FloatingHearts";
import dynamic from "next/dynamic";
import Link from "next/link";
import GenerateCode from "./components/GenerateCode";
import JoinCode from "./components/JoinCode";
import VideoCall from "./components/VideoCall";

const ChatWindow = dynamic(() => import("./components/ChatWindow"), {
  loading: () => (
    <div className="flex h-full items-center justify-center bg-white/40 rounded-xl backdrop-blur-xl">
      <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
    </div>
  ),
  ssr: false,
});

export default function Dashboard() {
  const { user, isLoading, isError } = useCouple();
  const { logoutMutation } = useAuth();
  const { isMuted, toggleMute } = useSound("/sounds/notification.mp3");

  /* ------------------------------------------------------ */
  /* LOADING SCREEN                                         */
  /* ------------------------------------------------------ */
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-6 
        bg-gradient-to-br from-pink-200 via-white to-purple-200 relative overflow-hidden">

        <FloatingHearts count={14} />

        <Loader2 className="animate-spin text-5xl text-pink-600" />
        <p className="text-lg font-medium text-pink-700">
          Setting up your LoveSpace…
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------ */
  /* ERROR SCREEN                                           */
  /* ------------------------------------------------------ */
  if (isError || !user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-white">
        <p className="text-red-500 text-lg font-medium">Something went wrong 😢</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Button variant="outline" onClick={() => logoutMutation.mutate()}>
          Logout
        </Button>
      </div>
    );
  }

  /* ------------------------------------------------------ */
  /* CASE 1: USER JUST REGISTERED — NO COUPLE CREATED        */
  /* ------------------------------------------------------ */
  if (!user.coupleId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 
        bg-gradient-to-br from-pink-200 via-white to-purple-200 relative overflow-hidden">

        <FloatingHearts count={20} />

        <div className="w-full max-w-md space-y-6 backdrop-blur-xl bg-white/60 
          border border-white/40 p-6 rounded-3xl shadow-xl">
          <GenerateCode />
          <div className="text-center text-gray-400">OR</div>
          <JoinCode />
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------ */
  /* CASE 2: WAITING FOR PARTNER                            */
  /* ------------------------------------------------------ */
  if (user.coupleId.inviteCode) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-6 
        bg-gradient-to-br from-pink-200 via-white to-purple-200 relative overflow-hidden p-4">

        <FloatingHearts count={18} />

        <div className="text-7xl animate-pulse">❤️</div>

        <h1 className="text-3xl font-bold text-gray-800 text-center drop-shadow-sm">
          Waiting for your partner to join…
        </h1>

        <div className="rounded-3xl backdrop-blur-xl bg-white/70 border border-white/40 
          p-6 shadow-xl text-center animate-fadeInSoft">
          <p className="text-gray-600 mb-2 text-sm">Share this code:</p>
          <p className="text-4xl font-mono tracking-widest text-pink-600 font-bold drop-shadow">
            {user.coupleId.inviteCode}
          </p>
        </div>

        <Button
          variant="ghost"
          className="text-gray-600 hover:text-red-600"
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </Button>
      </div>
    );
  }

  /* ------------------------------------------------------ */
  /* CASE 3: PARTNER CONNECTED — SHOW CHAT                  */
  /* ------------------------------------------------------ */
  const partnerId = user.coupleId.users.find(
    (id: any) => String(id) !== String(user._id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-purple-200 
      p-3 md:p-5 flex flex-col items-center relative overflow-hidden">

      <FloatingHearts count={20} />

      <div className="w-full max-w-5xl rounded-3xl backdrop-blur-xl bg-white/60 
        border border-white/40 shadow-2xl p-4 md:p-6 mt-4">

        {/* HEADER */}
        <header className="flex flex-col gap-4 pb-4 border-b border-white/50">
          <div className="flex items-center justify-between">

            <h1 className="text-2xl md:text-3xl font-extrabold text-pink-600 
              flex items-center gap-2 drop-shadow-sm">
              TwoSpace <Heart className="text-pink-500" fill="currentColor" size={26} />
            </h1>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-gray-400" />
                ) : (
                  <Volume2 className="h-5 w-5 text-pink-600" />
                )}
              </Button>

              <Link href="/diary">
                <Button variant="ghost" size="icon">
                  <BookHeart className="h-6 w-6 text-gray-600 hover:text-pink-600" />
                </Button>
              </Link>

              <Link href="/gallery">
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-6 w-6 text-gray-600 hover:text-pink-600" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="h-5 w-5 text-gray-500 hover:text-red-600" />
              </Button>
            </div>
          </div>

          {/* STATUS BAR */}
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl p-3 
            rounded-xl border border-white/40 shadow-sm">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected as <strong>{user.name}</strong>
            </div>

            {partnerId && (
              <VideoCall myId={String(user._id)} partnerId={String(partnerId)} />
            )}
          </div>
        </header>

        {/* CHAT WINDOW */}
        {partnerId ? (
          <div className="flex-1 h-[70vh] rounded-2xl overflow-hidden border border-white/40 
            shadow-inner bg-white/50 backdrop-blur-xl mt-4">
            <ChatWindow user={user} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[70vh] text-gray-500 text-lg">
            Connecting your LoveSpace…
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        .animate-float-soft {
          animation: floatSoft 4.5s ease-in-out infinite;
        }
        @keyframes floatSoft {
          0% { transform: translateY(0px); opacity: .6; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(0); opacity: .6; }
        }

        .animate-fadeInSoft {
          animation: fadeInSoft 1.2s ease-out;
        }
        @keyframes fadeInSoft {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
