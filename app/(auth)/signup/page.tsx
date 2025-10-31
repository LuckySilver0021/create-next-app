'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/app/schemas/signupSchema";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // ✅ better spinner
import Link from "next/link";

const Page = () => {
  const [username, setUsername] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  // React Hook Form with Zod validation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Check unique username
  useEffect(() => {
    const checkUniqueUsername = async () => {
      if (!username) return;
      setCheckingUsername(true);
      try {
        const res = await axios.get(`/api/uniqueuname?username=${username}`);
        if (res.data.success) {
          toast.success("Username available", {
            style: { background: "#e5ffe5", color: "#006400", border: "1px solid #006400" },
          });
        } else {
          toast.error("Username already taken", {
            style: { background: "#ffe5e5", color: "#b00020", border: "1px solid #b00020" },
          });
        }
      } catch {
        toast.error("Error checking username");
      } finally {
        setCheckingUsername(false);
      }
    };
    checkUniqueUsername();
  }, [username]);

  // Form submit
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/signup", data);
      toast.success(res.data.message);
      router.replace(`/verify/${data.username}`);
    } catch {
      toast.error("Error in signing up, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800 rounded-2xl p-8 backdrop-blur-md shadow-lg space-y-6">
        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Join Mystery Message</h1>
          <p className="text-gray-400 text-sm">Signup to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-300 text-sm">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      className="bg-neutral-800 border border-neutral-700 text-white focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-2 text-sm"
                    />
                  </FormControl>
                  {checkingUsername && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500 mt-1" />
                  )}
                  <FormDescription className="text-gray-400 text-xs">
                    This will be your public display name.
                  </FormDescription>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-300 text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      className="bg-neutral-800 border border-neutral-700 text-white focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-2 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-300 text-sm">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="bg-neutral-800 border border-neutral-700 text-white focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-2 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 px-5 py-2 text-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Please wait</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Sign in link */}
        <div className="text-center text-gray-400">
          Already a member?{" "}
          <Link href="/signin" className="text-indigo-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
