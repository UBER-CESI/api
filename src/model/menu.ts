import { Types } from "mongoose";
export interface IMenu {
  _id?: Types.ObjectId;
  name: String;
  description: String;
  items: Array<String>;
  price: Number;
  restaurantId: Types.ObjectId;
}

export interface IItem {
  _id?: Types.ObjectId;
  name: String;
  description: String;
  allergens: Array<String>;
  options?: Array<IItemOption>;
  restaurantId: Types.ObjectId;
}

export interface IItemOption {
  name: string;
  multiple: boolean;
  required: boolean;
  values: Array<IItemOptionValue>;
}
export interface IItemOptionValue {
  value: string;
  priceOffset: number;
}
