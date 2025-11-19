"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { loginMutation } = useAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  return (
    <div className="relative flex h-screen items-center justify-center px-4 bg-gradient-to-br from-pink-200 via-white to-purple-200 overflow-hidden">

      {/* Floating hearts + sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute text-pink-400 opacity-60 animate-float-soft"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 12}px`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          >
            {i % 2 === 0 ? "💖" : "✨"}
          </span>
        ))}
      </div>

      {/* Soft glowing aura */}
      <div className="absolute h-[400px] w-[400px] bg-pink-300 rounded-full blur-3xl opacity-40"></div>

      <Card className="relative w-full max-w-sm backdrop-blur-xl bg-white/60 border border-white/40 
        shadow-2xl rounded-3xl px-6 py-6 animate-fadeInSoft">

        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full 
            bg-gradient-to-br from-pink-300 to-pink-500 shadow-xl animate-heartGlow">
            <Heart className="h-10 w-10 text-white" fill="currentColor" />
          </div>

          <CardTitle className="text-3xl font-extrabold text-gray-800">
            Welcome Back 💞
          </CardTitle>

          <p className="text-gray-600 text-sm">
            Log into your shared world of love.
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="rounded-xl border-pink-300 focus-visible:ring-pink-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••"
                        className="rounded-xl border-pink-300 focus-visible:ring-pink-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-pink-600 text-lg font-semibold rounded-xl 
                shadow-md hover:bg-pink-700 hover:scale-[1.02] transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-5 text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-pink-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <style>{`
        .animate-float-soft {
          animation-name: floatSoft;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes floatSoft {
          0% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(-18px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.6; }
        }

        .animate-heartGlow {
          animation: heartGlow 3s ease-in-out infinite;
        }
        @keyframes heartGlow {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 120, 150, 0.4); }
          50% { transform: scale(1.08); box-shadow: 0 0 40px rgba(255, 100, 130, 0.7); }
          100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 120, 150, 0.4); }
        }

        .animate-fadeInSoft {
          animation: fadeInSoft 1s ease-out;
        }
        @keyframes fadeInSoft {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
