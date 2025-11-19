"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCouple } from "@/hooks/useCouple";
import { HeartHandshake } from "lucide-react";
import { useState } from "react";

export default function JoinCode() {
  const [code, setCode] = useState("");
  const { joinMutation } = useCouple();

  return (
    <Card
      className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl shadow-xl p-5 
      hover:shadow-2xl transition-all duration-300"
    >
      <CardHeader className="text-center space-y-3">
        {/* Lovely Icon */}
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full 
          bg-gradient-to-br from-purple-300 to-pink-400 shadow-lg animate-heartGlow"
        >
          <HeartHandshake className="h-8 w-8 text-white" />
        </div>

        <CardTitle className="text-xl font-bold text-purple-700 tracking-wide">
          Join Your Partner 💜
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-gray-600">
          Enter the 6-digit code that your partner shared with you.
        </p>

        {/* Input Field */}
        <Input
          placeholder="A1B2C3"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          className="rounded-xl text-center tracking-widest text-lg border-purple-300 
          focus-visible:ring-purple-400 bg-white/80 shadow-sm"
        />

        {/* Button */}
        <Button
          onClick={() => joinMutation.mutate(code)}
          disabled={joinMutation.isPending || code.length < 6}
          className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg 
          transition-all text-white font-semibold"
        >
          {joinMutation.isPending ? "Connecting..." : "Join Partner"}
        </Button>
      </CardContent>

      {/* Smooth Glow Animation */}
      <style>{`
        .animate-heartGlow {
          animation: heartGlow 3s ease-in-out infinite;
        }
        @keyframes heartGlow {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(150,80,255,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 35px rgba(160,60,255,0.7); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(150,80,255,0.4); }
        }
      `}</style>
    </Card>
  );
}
