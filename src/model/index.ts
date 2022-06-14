import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
} from "mongoose";
import { IMenu, IItem, IItemOption } from "./menu"
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

export const Restaurant = model<IRestaurant>("Restaurant", restaurantsSchema);
export const Menu = model<IMenu>("Menu", menusSchema);
export const Item = model<IItem>("Item", itemsSchema);

export const models: { model: mongoose.Model<any>; capabilities: string[] }[] =
  [{ model: Restaurant, capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT", "SUSPEND"] }];
mongoose.connection.on("error", () => {
  throw new Error("MongoDB Connection Error");
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
