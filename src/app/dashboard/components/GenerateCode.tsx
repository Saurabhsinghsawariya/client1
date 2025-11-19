"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCouple } from "@/hooks/useCouple";
import { Heart } from "lucide-react";

export default function GenerateCode() {
  const { generateMutation } = useCouple();

  return (
    <Card className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl shadow-xl p-4 
      hover:shadow-2xl transition-all duration-300">

      <CardHeader className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full 
          bg-gradient-to-br from-pink-300 to-pink-500 shadow-lg animate-heartGlow">
          <Heart className="h-8 w-8 text-white" fill="currentColor" />
        </div>

        <CardTitle className="text-xl font-bold text-pink-700 tracking-wide">
          Start a New LoveSpace 💞
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-gray-600">
          Generate a secret code and invite your partner into your private world.
        </p>

        <Button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending}
          className="w-full h-11 rounded-xl bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg 
          transition-all text-white font-semibold"
        >
          {generateMutation.isPending ? "Generating..." : "Generate Code"}
        </Button>
      </CardContent>

      <style>{`
        .animate-heartGlow {
          animation: heartGlow 3s ease-in-out infinite;
        }
        @keyframes heartGlow {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(255,120,150,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 35px rgba(255,100,130,0.7); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(255,120,150,0.4); }
        }
      `}</style>
    </Card>
  );
}
