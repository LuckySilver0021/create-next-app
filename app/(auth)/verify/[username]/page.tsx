"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/app/schemas/verifySchema";
import axios from "axios";
import React, { useState } from "react";
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

const Page = () => {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/verify`, { code: data.code, username });
      toast.success(res.data.message);
      router.replace("/signin");
    } catch (error) {
      toast.error("Error verifying code. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-neutral-900/60 border border-neutral-800 backdrop-blur-md rounded-2xl p-8 shadow-lg flex flex-col justify-center space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel className="text-gray-300 text-sm text-center mb-2">
                    Enter the verification code
                  </FormLabel>
                  <FormControl className="w-full max-w-sm">
                    <Input
                      {...field}
                      placeholder="Verification Code"
                      className="bg-neutral-800/80 text-white border border-neutral-700 focus:ring-1 focus:ring-indigo-600 rounded-xl px-4 py-3 text-center placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-gray-400 text-sm text-center mt-1" />
                </FormItem>

              )}
            />


            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 flex items-center gap-2 justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Please wait</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;



