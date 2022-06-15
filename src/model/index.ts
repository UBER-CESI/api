import { Router } from "express";
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

interface ICustomer {
  _id?: ObjectId;
  userId: Number;
  email: string;
  nickname: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  suspendedAt?: Date;
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

const Customer = model<ICustomer>("Customer", usersSchema);

export const models: {
  model: mongoose.Model<any>;
  capabilities: string[];
  path: string;
  extraCapabilities: [(router: Router) => void];
}[] = [
  {
    model: Customer,
    capabilities: ["CREATE", "GET", "LIST", "DELETE", "EDIT", "SUSPEND"],
    path: "/",
    extraCapabilities: [
      function orderHistory(router: Router) {
        /*router.post("/:id/history", async (req, res) => {
          const single = await Customer.findOne({ _id: req.params.id });
          if (!single) return res.sendStatus(404);
          single.suspendedAt = new Date();
          await single.save();
          return res.send(single);
        });*/
      },
      function suspend(router: Router) {
        router.post("/:id/suspend", async (req, res) => {
          const single = await Customer.findOne({ _id: req.params.id });
          if (!single) return res.sendStatus(404);
          single.suspendedAt = new Date();
          await single.save();
          return res.send(single);
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
