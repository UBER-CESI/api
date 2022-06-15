import { Router } from "express";
import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
} from "mongoose";

mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  authSource: "admin",
});
export default mongoose;

interface IDeliverer {
  _id?: ObjectId;
  userId: Number;
  email: string;
  nickname: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  suspendedAt?: Date;
}

const usersSchema = new Schema<IDeliverer>({
  userId: Number,
  email: String,
  nickname: String,
  firstname: String,
  lastname: String,
  phoneNumber: String,
  suspendedAt: Date,
});

const Deliverer = model<IDeliverer>("Deliverer", usersSchema);

export const models: {
  model: mongoose.Model<any>;
  capabilities: string[];
  path: "/";
}[] = [
  {
    model: Deliverer,
    capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT", "SUSPEND"],
    path: "/",
    extraCapabilities: ((router: Router) => void)[];
  },
];
mongoose.connection.on("error", () => {
  throw new Error("MongoDB Connection Error");
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
