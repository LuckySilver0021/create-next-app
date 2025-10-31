"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { accpetMessageSchema } from "@/app/schemas/acceptMessageSchema";
import { Message } from "@/app/db/User";

import MessageCard from "@/components/MessageCard";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, Copy, CheckCircle2 } from "lucide-react";

const DashboardPage = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const prevMessagesCount = useRef<number>(0);

  const form = useForm({ resolver: zodResolver(accpetMessageSchema) });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const res = await axios.get("/api/acceptmessage");
      setValue("acceptMessages", res.data.isAccpetingMessages);
    } catch {
      toast.error("Failed to fetch message settings");
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (manualRefresh = false, suppressErrorToast = false) => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getAllMessages");
        const newMessages: Message[] = res.data.messages || [];

        // Check if new message arrived
        if (newMessages.length > prevMessagesCount.current) {
          toast.success("New message received!");
        }

        setMessages(newMessages);
        prevMessagesCount.current = newMessages.length;

        // Manual refresh toast
        if (manualRefresh) toast.success("Messages refreshed successfully");
      } catch {
        if (!suppressErrorToast) {
          toast.error("Failed to fetch messages");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (session) {
      fetchAcceptMessage();
      fetchMessages(false, true); // initial fetch, suppress toast
    }
  }, [session, fetchAcceptMessage, fetchMessages]);

  // Auto-refresh every 6 seconds silently, but notify new messages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(false, true); // suppress error toast
    }, 6000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSwitchChange = async (checked: boolean) => {
    try {
      await axios.post("/api/acceptmessage", { acceptMessages: checked });
      setValue("acceptMessages", checked);
      toast.success(`You are now ${checked ? "accepting" : "not accepting"} messages`);
    } catch {
      toast.error("Failed to update message settings");
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg._id?.toString() !== id));
    prevMessagesCount.current = messages.length - 1;
  };

  if (!session)
    return <div className="text-center text-white mt-20">Please login first</div>;

  const username = session.user.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/user/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            Manage your messages and preferences
          </p>
        </div>

        {/* Profile Link */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h2 className="text-lg font-medium mb-2">Your Unique Link</h2>
          <p className="text-sm text-gray-400 mb-4">
            Share this link to receive anonymous messages.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <Button
              onClick={copyToClipboard}
              className={`relative overflow-hidden flex items-center gap-2 rounded-xl px-4 py-2 text-white transition-all duration-500 ease-in-out ${
                copied
                  ? "bg-green-600 hover:bg-green-600 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              <div
                className={`transition-opacity duration-300 ease-in-out ${
                  copied ? "opacity-0" : "opacity-100"
                }`}
              >
                <Copy className="w-4 h-4" />
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                  copied ? "opacity-100" : "opacity-0"
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span
                className={`transition-opacity duration-300 ease-in-out ${
                  copied ? "opacity-0" : "opacity-100"
                }`}
              >
                Copy
              </span>
            </Button>
          </div>
        </div>

        {/* Message Preferences */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex items-center justify-between backdrop-blur-md">
          <div>
            <h2 className="text-lg font-medium">Message Preferences</h2>
            <p className="text-sm text-gray-400">
              Toggle to accept or reject messages.
            </p>
          </div>
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={switchLoading}
            className="data-[state=checked]:bg-indigo-600 transition"
          />
        </div>

        {/* Refresh */}
        <div className="flex justify-end">
          <Button
            onClick={() => fetchMessages(true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        {/* Messages */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-lg font-medium mb-4">Messages</h2>
          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((msg, idx) => (
                <MessageCard
                  key={msg._id?.toString() ?? idx}
                  message={msg}
                  onMsgDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No messages yet — share your link to start receiving them.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

