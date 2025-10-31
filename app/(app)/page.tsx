'use client';

import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messagesData from '@/seed/data.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const messages: Message[] = messagesData;

interface Message {
  title: string;
  content: string;
  received: string;
}

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-black text-white">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
            Anonymous Feedback. Real & Unfiltered.
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Honest feedback, with no strings attached.
          </p>
        </section>

        {/* Carousel for Messages — updated styling */}
        <Carousel
          plugins={[Autoplay({ delay: 2770 })]}
          className="w-full max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card
                  className="
                    bg-neutral-950
                    border border-neutral-800
                    rounded-2xl
                    shadow-[0_0_25px_-12px_rgba(255,255,255,0.05)]
                    transition-all duration-300
                    hover:shadow-[0_0_35px_-10px_rgba(255,255,255,0.08)]
                    hover:border-neutral-700
                  "
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg font-medium tracking-wide">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-neutral-500 mt-1 shrink-0" />
                    <div>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs text-neutral-600 mt-3 tracking-wide">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center bg-neutral-900 text-neutral-400 border-t border-neutral-700">
        <p>© {new Date().getFullYear()} True Feedback. All rights reserved.</p>
      </footer>
    </>
  );
}
