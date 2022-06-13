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

export interface IItem {
  _id?: ObjectId;
  name: String;
  description: String;
  allergens: Array<String>;
  subItems: Array<String>;
  restaurantId: String;
}

export interface IOrder {
  _id?: ObjectId;
  restaurantId: String;
  customerId: String;
  delivererId: String;
  totalPrice: Number;
  items: Array<IItem>;
}

const restaurantsSchema = new Schema<IOrder>({
  restaurantId: String,
  customerId: String,
  delivererId: String,
  totalPrice: Number,
  items: Array<IItem>
});

const itemsSchema = new Schema<IItem>({
  restaurantId: String,
  description: String,
  allergens: Array<String>,
  subItems: Array<String>
});

export const Order = model<IOrder>("Order", restaurantsSchema);
export const Item = model<IItem>("Item", itemsSchema);

mongoose.connection.on("error", () => {
  throw new Error("MongoDB Connection Error");
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
