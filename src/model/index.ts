import { Router } from "express";
import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
} from "mongoose";

import { PushSubscription } from "web-push";

if (!process.env.DB_HOST) throw new Error("DB_HOST env arg not specified");
mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  authSource: process.env.DB_NAME,
  ssl: false,
});
export default mongoose;

export interface PushSubscriptions {
  [endpoint: string]: PushSubscription
}

export const models: {
  model: mongoose.Model<any>;
  capabilities: string[];
  path: string;
  extraCapabilities: ((router: Router) => void)[];
}[] = [];
mongoose.connection.on("error", (e) => {
  throw new Error(e.reason);
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
