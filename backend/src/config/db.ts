import { MongoClient } from "mongodb";

let client: MongoClient;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    client = new MongoClient(uri);
    await client.connect();

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export const getClient = () => client;