"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDiary } from "@/hooks/useDiary";
import { format } from "date-fns";
import { ArrowLeft, Heart, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MOODS = ["😊", "😂", "❤️", "😢", "😡", "😴", "🔥", "🎉"];

export default function DiaryPage() {
  const { entries, isLoading, createMutation, deleteMutation } = useDiary();
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("😊");

  const handleSubmit = () => {
    if (!title || !content) return;
    createMutation.mutate(
      { title, content, mood },
      {
        onSuccess: () => {
          setIsOpen(false);
          setTitle("");
          setContent("");
          setMood("😊");
        },
      }
    );
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8 bg-gradient-to-br from-pink-100 via-amber-50 to-purple-100 overflow-hidden">

      {/* Floating background decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute text-pink-300 animate-float-soft"
            style={{
              top: `${Math.random() * 95}%`,
              left: `${Math.random() * 95}%`,
              fontSize: `${Math.random() * 24 + 12}px`,
              animationDuration: `${Math.random() * 4 + 3}s`,
            }}
          >
            {i % 2 ? "✨" : "💖"}
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto backdrop-blur-xl rounded-2xl p-3 bg-white/50 border border-white/40 shadow-lg">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 hover:bg-pink-100 text-pink-700 font-medium">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>

        <h1 className="text-3xl font-extrabold text-pink-700 flex items-center gap-2 drop-shadow">
          Our Diary <Heart className="text-pink-600" fill="currentColor" />
        </h1>

        {/* Write New Entry */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white gap-2 rounded-full shadow-xl">
              <Plus className="h-4 w-4" /> Write
            </Button>
          </DialogTrigger>

          <DialogContent className="rounded-3xl shadow-2xl bg-white/90 backdrop-blur-xl border border-pink-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-pink-700">
                Dear Diary…
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Mood Selector */}
              <div>
                <label className="text-sm text-gray-500 mb-2 block">How are you feeling?</label>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`text-3xl p-2 rounded-full transition shadow-sm ${
                        mood === m
                          ? "bg-pink-200 scale-110 shadow-lg"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <Input
                placeholder="Title (e.g., Our Date Night 💕)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-pink-300 focus-visible:ring-pink-500 shadow-sm"
              />

              {/* Content */}
              <Textarea
                placeholder="Write your lovely memory here..."
                className="min-h-[160px] rounded-xl border-pink-300 focus-visible:ring-pink-500 shadow-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/* Button */}
              <Button
                className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-lg rounded-xl shadow-md hover:shadow-lg transition"
                onClick={handleSubmit}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Saving..." : "Save Memory 💗"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Diary Entries */}
      <div className="max-w-3xl mx-auto space-y-5">
        {isLoading ? (
          <p className="text-center text-gray-400 animate-pulse">Opening your diary…</p>
        ) : entries?.length === 0 ? (
          <div className="text-center py-20 opacity-70 border-2 border-dashed border-pink-200 rounded-3xl bg-white/40 shadow-inner">
            <div className="text-6xl mb-4">📓</div>
            <p className="text-pink-700 text-lg font-medium">
              Write your first lovely memory together.
            </p>
          </div>
        ) : (
          entries.map((entry: any) => (
            <Card
              key={entry._id}
              className="rounded-3xl border-l-4 border-pink-400 shadow-md hover:shadow-xl transition bg-white/80 backdrop-blur"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-1">
                <div>
                  <div className="text-xs font-semibold text-pink-600 flex items-center gap-2 mb-1 uppercase tracking-wide">
                    <span>{format(new Date(entry.date), "MMMM do, yyyy")}</span>
                    <span>•</span>
                    <span className="text-xl">{entry.mood}</span>
                  </div>

                  <CardTitle className="text-xl text-gray-800 font-bold">
                    {entry.title}
                  </CardTitle>
                </div>

                {/* Delete Entry */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                  onClick={() => deleteMutation.mutate(entry._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-white/40 p-3 rounded-xl shadow-sm">
                  {entry.content}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                  <span className="text-xs text-gray-500 italic">
                    Written by {entry.authorId?.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <style>{`
        .animate-float-soft {
          animation: floatSoft 4s ease-in-out infinite;
        }
        @keyframes floatSoft {
          0% { transform: translateY(0px); opacity: .6; }
          50% { transform: translateY(-16px); opacity: 1; }
          100% { transform: translateY(0px); opacity: .6; }
        }
      `}</style>
    </div>
  );
}
