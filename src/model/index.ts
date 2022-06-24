import { Router } from "express";
import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
} from "mongoose";
import { IMenu, IItem, IItemOption, IOrder } from "./menu"

if (!process.env.DB_HOST) throw new Error("DB_HOST env arg not specified");
mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  authSource: process.env.DB_NAME,
  ssl: false,
});
export default mongoose;


export interface IRestaurant {
  _id?: ObjectId;
  userId: Number;
  email: string;
  name: String;
  phoneNumber: string;
  address: string;
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
  address: String,
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
  date: Date
})

export const Restaurant = model<IRestaurant>("Restaurant", restaurantsSchema);
export const Menu = model<IMenu>("Menu", menusSchema);
export const Item = model<IItem>("Item", itemsSchema);
export const Order = model<IOrder>("Order", ordersSchema);

export const models: { model: mongoose.Model<any>; capabilities: string[], path: string, extraCapabilities: ((router: Router) => void)[]; }[] =
  [{
    model: Restaurant, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT", "SUSPEND"], path: "/", extraCapabilities: [
      function stats(router: Router) {
        router.get("/:id/stats", async (req, res) => {
          const stats: any = {}
          stats.totalOrderNumber = (await Order.find({ restaurantId: req.params.id })).length;
          let lastweek = new Date()
          lastweek.setDate(lastweek.getDate() - 7)
          stats.weeklyOrderNumber = (await Order.find({
            date: {
              $gte: lastweek
            }
          })).length
          let lastMonth = new Date()
          lastMonth.setDate(lastMonth.getDate() - 7)
          stats.monthlyOrderNumber = (await Order.find({
            date: {
              $gte: lastMonth
            }
          })).length
          return res.send(stats);
        });
      },
      function history(router: Router) {
        router.get("/:id/history", async (req, res) => {
          const multiple = await Order.find({ restaurantId: req.params.id });
          if (!multiple) return res.sendStatus(404);
          return res.send(multiple);
        });
      },
    ]
  },
  { model: Menu, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT",], path: "/:restId/menu/", extraCapabilities: [] },
  { model: Item, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT",], path: "/:restId/item/", extraCapabilities: [] }];
mongoose.connection.on("error", (e) => {
  throw new Error(e.reason);
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
