"use client";

import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { X } from "lucide-react";
import { Message } from "@/app/db/User";
import { toast } from "sonner";
import axios from "axios";

type MessageCardProps = {
  message: Message;
  onMsgDelete: (id: string) => void;
};

const MessageCard = ({ message, onMsgDelete }: MessageCardProps) => {
  const deleteConfirm = async () => {
    try {
      const res = await axios.delete(`/api/deletemessage/${message._id}`);
      toast.success(res.data.message);
      onMsgDelete(message._id.toString());
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const formattedDate = message.createdAt
    ? new Date(message.createdAt).toLocaleString()
    : "";

  return (
    <Card className="relative bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 hover:shadow-lg transition-all duration-300 backdrop-blur-md">
      {/* Delete Button */}
      <div className="absolute top-3 right-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold">
                Delete Message
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-neutral-800 hover:bg-neutral-700 text-gray-300">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Message Content */}
      <div className="space-y-3">
        <p className="text-base text-gray-100 leading-relaxed">{message.content}</p>
        {formattedDate && (
          <p className="text-xs text-gray-500 text-right">{formattedDate}</p>
        )}
      </div>
    </Card>
  );
};

export default MessageCard;

