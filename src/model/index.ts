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
  subItems?: Array<String>;
  restaurantId: String;
}

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
  subItems: Array<String>,
  restaurantId: String,
});

const restaurantsSchema = new Schema<IRestaurant>({
  userId: Number,
  email: String,
  name: String,
  phoneNumber: String,
});

export const Restaurant = model<IRestaurant>("Restaurant", restaurantsSchema);
export const Item = model<IItem>("Item", itemsSchema);

mongoose.connection.on("error", () => {
  throw new Error("MongoDB Connection Error");
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
