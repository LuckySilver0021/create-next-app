import { Message } from "../db/User"; // fixed typo

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  // Optional additional payload or error info
  data?: T;
  error?: any;
}

