import Mongoose, {Schema, Document } from "mongoose";


type ConnectionObj={
    isConnected?: number
}

const connection: ConnectionObj = {};

export async function connectToDB() {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }
  try{
    await Mongoose.connect(process.env.MONGODB_URI as string);
    connection.isConnected = Mongoose.connection.readyState;
    console.log("Connected to MongoDB");
  }
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to database");
  }
}