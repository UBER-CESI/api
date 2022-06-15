import { Router } from "express";
import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
  Types,
} from "mongoose";

mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  authSource: "admin",
});
export default mongoose;

interface ICustomer {
  _id?: Types.ObjectId;
  userId: Number;
  email: string;
  nickname: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  suspendedAt?: Date;
}

export interface IOrder {
  _id?: ObjectId;
  restaurantId: Types.ObjectId;
  customerId: Types.ObjectId;
  delivererId: Types.ObjectId;
  totalPrice: Number;
  tipAmount: Number;
  items: Array<any>;
}

const usersSchema = new Schema<ICustomer>({
  userId: Number,
  email: String,
  nickname: String,
  firstname: String,
  lastname: String,
  phoneNumber: String,
  suspendedAt: Date,
});



const ordersSchema = new Schema<IOrder>({
  /*restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
  delivererId: { type: Schema.Types.ObjectId, ref: "Deliverer" },*/
  restaurantId: String,
  customerId: String,
  delivererId: String,
  totalPrice: Number,
  items: Array<any>
})

export const Order = model<IOrder>("Order", ordersSchema);

const Customer = model<ICustomer>("Customer", usersSchema);

export const models: {
  model: mongoose.Model<any>;
  capabilities: string[];
  path: string;
  extraCapabilities: ((router: Router) => void)[];
}[] = [
  {
    model: Customer,
    capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT", "SUSPEND"],
    path: "/",
    extraCapabilities: [
      function orderHistory(router: Router) {
        router.get("/:id/history", async (req, res) => {
          const multiple = await Order.find({ customerId: req.params.id });
          if (!multiple) return res.sendStatus(404);
          return res.send(multiple);
        });
      },
    ],
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
