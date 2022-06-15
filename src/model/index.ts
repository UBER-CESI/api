import { Router } from "express";
import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
} from "mongoose";
import { IMenu, IItem, IItemOption, IOrder } from "./menu"
mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  authSource: "admin",
});
export default mongoose;


export interface IRestaurant {
  _id?: ObjectId;
  userId: Number;
  email: string;
  name: String;
  phoneNumber: string;
}

const itemsSchema = new Schema<IItem>({
  name: String,
  description: String,
  allergens: Array<String>,
  options: Array<IItemOption>,
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
});

const menusSchema = new Schema<IMenu>({
  name: String,
  description: String,
  items: Array<Schema.Types.ObjectId>,
  price: Number,
  restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
});

const restaurantsSchema = new Schema<IRestaurant>({
  userId: Number,
  email: String,
  name: String,
  phoneNumber: String,
});

const ordersSchema = new Schema<IOrder>({
  /*restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  delivererId: { type: Schema.Types.ObjectId, ref: "Deliverer" },*/
  restaurantId: String,
  customerId: String,
  delivererId: String,
  totalPrice: Number,
  items: Array<any>,
  date:Date
})

export const Restaurant = model<IRestaurant>("Restaurant", restaurantsSchema);
export const Menu = model<IMenu>("Menu", menusSchema);
export const Item = model<IItem>("Item", itemsSchema);
export const Order = model<IOrder>("Order", ordersSchema);

export const models: { model: mongoose.Model<any>; capabilities: string[], path: string, extraCapabilities: ((router: Router) => void)[]; }[] =
  [{ model: Restaurant, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT", "SUSPEND"], path: "/", extraCapabilities: [
    function orderHistory(router: Router) {
      router.get("/:id/history", async (req, res) => {
        const multiple = await Order.find({ restaurantId: req.params.id });
        if (!multiple) return res.sendStatus(404);
        return res.send(multiple);
      });
    },
  ] },
  { model: Menu, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT",], path: "/:id/menu/", extraCapabilities: [] },
  { model: Item, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT",], path: "/:id/item/", extraCapabilities: [] }];
mongoose.connection.on("error", () => {
  throw new Error("MongoDB Connection Error");
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
