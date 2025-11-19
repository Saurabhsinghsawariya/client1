"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCouple } from "@/hooks/useCouple";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const { user, isLoading: isAuthLoading } = useCouple();

  const { data: healthStatus } = useQuery({
    queryKey: ["health-check"],
    queryFn: async () => {
      try {
        const res = await api.get("/");
        return { status: "online", message: res.data };
      } catch (err) {
        return { status: "offline", message: "Server Offline" };
      }
    },
    retry: 1,
  });

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || (user && !isAuthLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-pink-50">
        <Loader2 className="h-10 w-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 
      bg-gradient-to-b from-pink-200 via-white to-purple-200 overflow-hidden">

      {/* Floating sparkles & hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-pink-300 opacity-50 animate-float-soft"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 25 + 10}px`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          >
            {i % 2 === 0 ? "💖" : "✨"}
          </span>
        ))}
      </div>

      {/* Glowing aura behind card */}
      <div className="absolute h-[350px] w-[350px] rounded-full bg-pink-300 opacity-40 blur-3xl"></div>

      <Card className="relative w-full max-w-md backdrop-blur-2xl bg-white/60 border border-white/40 
        shadow-2xl rounded-3xl px-4 py-6 animate-fadeInSoft">

        <CardHeader className="text-center space-y-4 pb-4">
          {/* Heart Icon */}
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full 
            bg-gradient-to-br from-pink-300 to-pink-500 shadow-xl animate-heartGlow">
            <Heart className="h-12 w-12 text-white" fill="currentColor" />
          </div>

          <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900">
            TwoSpace 💞
          </CardTitle>

          <p className="text-gray-700 text-sm sm:text-base font-medium">
            A cozy, private love-world where only the two of you exist.
          </p>
        </CardHeader>

        <CardContent className="space-y-5 mt-4">
          <Link href="/login" className="block w-full">
            <Button className="w-full bg-pink-600 h-12 text-lg font-semibold rounded-xl shadow-md 
              hover:bg-pink-700 hover:shadow-lg hover:scale-[1.03] transition-all">
              Login
            </Button>
          </Link>

          <Link href="/register" className="block w-full">
            <Button
              variant="outline"
              className="w-full h-12 text-lg font-semibold rounded-xl border-pink-400 text-pink-700
              hover:bg-pink-50 hover:border-pink-500 hover:scale-[1.02] shadow-sm transition-all"
            >
              Create Account
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* System health */}
      <div className="absolute bottom-6 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            healthStatus?.status === "online" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span>
          {healthStatus?.status === "online" ? "System Online" : "Connecting…"}
        </span>
      </div>

      {/* Extra Cute Animations */}
      <style>{`
        .animate-float-soft {
          animation-name: floatSoft;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes floatSoft {
          0% { transform: translateY(0px); opacity: 0.7; }
          50% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.7; }
        }

        .animate-heartGlow {
          animation: heartGlow 3s ease-in-out infinite;
        }
        @keyframes heartGlow {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 120, 150, 0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 40px rgba(255, 100, 130, 0.7); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 120, 150, 0.4); }
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
