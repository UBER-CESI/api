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

mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  authSource: "admin",
});
export default mongoose;


export interface IOrder {
  _id?: ObjectId;
  restaurantId: Types.ObjectId;
  customerId: Types.ObjectId;
  delivererId: Types.ObjectId;
  totalPrice: Number;
  tipAmount: Number;
  items: Array<IItem | IMenu>;
  status:String;
}

const ordersSchema = new Schema<IOrder>({
  /*restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  delivererId: { type: Schema.Types.ObjectId, ref: "Deliverer" },*/
  restaurantId: String,
  customerId: String,
  delivererId: String,
  totalPrice: Number,
  items: Array<IItem | IMenu>,
  status:String,
})

export const Order = model<IOrder>("Order", ordersSchema);

export const models: { model: mongoose.Model<any>; capabilities: string[], path: string, extraCapabilities?: ((router: Router) => void)[]; }[] =
  [{ model: Order, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT"], path: "/",extraCapabilities:[] }];
mongoose.connection.on("error", () => {
  throw new Error("MongoDB Connection Error");
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
