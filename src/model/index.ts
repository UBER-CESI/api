import { Router } from "express";
import mongoose, {
  Schema,
  Connection,
  model,
  ObjectId,
  Number,
  Types,
} from "mongoose";
import { PushSubscription } from "web-push";

if (!process.env.DB_HOST) throw new Error("DB_HOST env arg not specified");
mongoose.connect(process.env.DB_HOST + "/" + process.env.DB_NAME, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  authSource: process.env.DB_NAME,
  ssl: false,
});
export default mongoose;

export interface PushSubscriptions {
  [endpoint: string]: PushSubscription
}

interface ICustomer {
  _id?: Types.ObjectId;
  userId: Number;
  email: string;
  nickname: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  suspendedAt?: Date;
  subscriptions?: PushSubscriptions;
}

export interface IOrder {
  _id?: ObjectId;
  restaurantId: Types.ObjectId;
  customerId: Types.ObjectId;
  delivererId: Types.ObjectId;
  totalPrice: Number;
  tipAmount: Number;
  items: Array<any>;
  date: Date;
}

const usersSchema = new Schema<ICustomer>({
  userId: Number,
  email: String,
  nickname: String,
  firstname: String,
  lastname: String,
  phoneNumber: String,
  suspendedAt: Date,
  subscriptions: Object,
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
  date: Date,
})

export const Order = model<IOrder>("Order", ordersSchema);

export const Customer = model<ICustomer>("Customer", usersSchema);

export const models: {
  model: mongoose.Model<any>;
  capabilities: string[];
  path: string;
  extraCapabilities: ((router: Router) => void)[];
}[] = [
    {
      model: Customer,
      capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT", "SUSPEND", "SUBSCRIBE", "UNSUBSCRIBE"],
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

mongoose.connection.on("error", (e) => {
  throw new Error(e.reason);
});
export const init = new Promise<Connection>((resolve) => {
  mongoose.connection.once("open", () => {
    resolve(mongoose.connection);
  });
});
