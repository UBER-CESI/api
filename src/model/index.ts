import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
  Types,
} from "mongoose";
import { IMenu, IItem } from "./menu";

mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  authSource: "admin",
});
export default mongoose;

export const models: {
  model: mongoose.Model<any>;
  capabilities: string[];
  path: string;
}[] = [];
mongoose.connection.on("error", () => {
  throw new Error("MongoDB Connection Error");
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
