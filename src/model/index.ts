import { Router } from "express";
import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
  Types,
} from "mongoose";
import { IMenu, IItem } from "./menu"

if (!process.env.DB_HOST) throw new Error("DB_HOST env arg not specified");
mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  authSource: process.env.DB_NAME,
  ssl: false,
});
export default mongoose;

interface PushSubscriptions {
  [endpoint: string]: {
    expirationTime: number;
    keys: Record<"p256dh" | "auth", string>
  }
}

export interface IOrder {
  _id?: ObjectId;
  restaurantId: Types.ObjectId;
  customerId: Types.ObjectId;
  delivererId: Types.ObjectId;
  totalPrice: Number;
  tipAmount: Number;
  menus: Array<IMenu>;
  status: String;
  address: String;
}

const ordersSchema = new Schema<IOrder>({
  /*restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  delivererId: { type: Schema.Types.ObjectId, ref: "Deliverer" },*/
  restaurantId: String,
  customerId: String,
  delivererId: String,
  totalPrice: Number,
  menus: Array<IMenu>,
  status: String,
  address: String
})

export const Order = model<IOrder>("Order", ordersSchema);

export const models: { model: mongoose.Model<any>; capabilities: string[], path: string, extraCapabilities: ((router: Router) => void)[]; }[] =
  [{ model: Order, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT"], path: "/", extraCapabilities: [] }];

mongoose.connection.on("error", (e) => {
  throw new Error(e.reason);
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
