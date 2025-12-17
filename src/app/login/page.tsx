"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');

      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black">
      {/* Left: Login Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 md:px-24">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold tracking-tight text-white mb-8 block">TradeZend</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-zinc-400">
              Enter your credentials to access your trading ops center.
            </p>
          </div>

          <div className="backdrop-blur-xl border border-white/5 rounded-2xl p-6 bg-zinc-900/50 shadow-2xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="bg-black/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-blue-500/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4 opacity-50" />}
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline hover:text-white transition-colors">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>

      {/* Right: Premium Visual */}
      <div className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden bg-zinc-900 border-l border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />

        <div className="relative z-10 max-w-lg text-center px-8">
          <div className="relative mb-8 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative aspect-video rounded-xl bg-black border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="text-zinc-700 font-mono text-sm">[ Dashboard Preview Loading... ]</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">"The most advanced journaling tool I've ever used."</h2>
          <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
            <span className="w-8 h-[1px] bg-zinc-700" />
            <span>Used by 1,000+ Pro Traders</span>
            <span className="w-8 h-[1px] bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
