import { Message } from "../db/User"; // fixed typo

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}

