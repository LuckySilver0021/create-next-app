"use client";

import { connectToDB } from "@/app/lib/connectToDB";
import { signinSchema } from "@/app/schemas/signInSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const page = () => {
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (res?.error) {
      toast.error("Could not find you 😕");
    }
    if (res?.url) {
      toast.success("Signed in successfully");
      router.replace("/dashboard");
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-black px-4 text-white font-[Inter,Geist_Sans,system-ui]"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-700/80 bg-linear-to-b from-neutral-950 via-neutral-950/90 to-neutral-900/80 
        p-8 shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)] backdrop-blur-sm transition-all duration-300 hover:border-neutral-600"
      >
        <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
          Sign In
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300 text-sm">
                    Username or Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 
                      focus:border-indigo-500 focus:ring-0 rounded-lg transition-colors"
                      placeholder="Enter your username or email"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-300 text-sm">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className="bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 
                      focus:border-indigo-500 focus:ring-0 rounded-lg transition-colors"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 transition"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-500 hover:text-indigo-400 underline underline-offset-2"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
