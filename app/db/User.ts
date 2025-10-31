import mongoose, { Schema, Document, Model, Types } from "mongoose";



export interface Message extends Document {
  _id: Types.ObjectId | string; 
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  isVerified: boolean;
  messages: Message[];
}


const MessageSchema = new Schema<Message>({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

const UserSchema = new Schema<User>({
  username: { type: String, required: [true, "Username can't be empty"], trim: true, unique: true },
  email: { type: String, required: [true, "Email can't be empty"], unique: true, match: [/.+\@.+\..+/, "Please fill a valid email"] },
  password: { type: String, required: [true, "Password can't be empty"] },
  verifyCode: { type: String, required: [true, "Verification code can't be empty"] },
  verifyCodeExpiry: { type: Date, required: [true, "Verification code expiry can't be empty"] },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
});


export const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export const MessageModel: Model<Message> =
  mongoose.models.Message || mongoose.model<Message>("Message", MessageSchema);

export default {
  UserModel,
  MessageModel,
};
