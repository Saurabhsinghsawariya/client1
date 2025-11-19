"use client";

import FloatingHearts from "@/components/FloatingHearts";
import UploadWidget from "@/components/gallery/UploadWidget";
import { Card } from "@/components/ui/card";
import { useMemories } from "@/hooks/useMemories";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const { memories, isLoading } = useMemories();

  return (
    <div className="min-h-screen relative overflow-hidden 
      bg-gradient-to-br from-pink-100 via-white to-purple-100 p-4 md:p-8">

      {/* ✨ Floating Hearts (SSR Safe) */}
      <FloatingHearts count={16} />

      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Space
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-pink-600 flex items-center gap-2 drop-shadow-sm">
          Our Memory Vault <Heart fill="currentColor" className="text-pink-500" />
        </h1>

        <UploadWidget />
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="animate-pulse text-gray-400 text-lg">
              Loading memories…
            </span>
          </div>
        ) : memories?.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-xl 
            border border-dashed border-pink-200 shadow-xl">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-600 text-lg font-medium">
              No memories yet.
            </p>
            <p className="text-sm text-gray-400">
              Upload your first photo above!
            </p>
          </div>
        ) : (
          /* Masonry-style Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memories.map((mem: any) => (
              <Card
                key={mem._id}
                className="overflow-hidden group relative rounded-2xl shadow-md transition hover:shadow-2xl"
              >
                <img
                  src={mem.imageUrl}
                  alt="Memory"
                  className="h-full w-full object-cover aspect-square 
                    transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Soft overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                  transition-all rounded-2xl" />
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        .animate-float-soft {
          animation: floatSoft 4.5s ease-in-out infinite;
        }
        @keyframes floatSoft {
          0% { transform: translateY(0px); opacity: .5; }
          50% { transform: translateY(-18px); opacity: 1; }
          100% { transform: translateY(0px); opacity: .5; }
        }
      `}</style>
    </div>
  );
}
