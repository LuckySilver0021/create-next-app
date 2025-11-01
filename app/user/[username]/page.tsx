'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/app/schemas/messageSchema';

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      await axios.post('/api/sendMessage', { ...data, username });
      toast.success('Message sent successfully');
      form.reset({ content: '' });
    } catch {
      toast.error("User is currently not accepting messages.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-xl bg-neutral-900/60 border border-neutral-800 rounded-2xl p-10 backdrop-blur-md shadow-lg space-y-8">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-semibold text-center tracking-tight">
          Send Anonymous Message
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-gray-300 text-sm md:text-base">
                    Message to {username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message..."
                      className="resize-none rounded-lg border border-neutral-700 bg-neutral-800/80 text-white text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-gray-400 text-xs md:text-sm" />
                </FormItem>
              )}
            />

            <div className="flex justify-center pt-3">
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 px-5 py-2 text-sm md:text-base transition-all"
              >
                {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                <span>{isLoading ? 'Please wait' : 'Send'}</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
