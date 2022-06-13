import express, { Router } from "express";
import { init } from "model";
import { Order } from "model";
const listen_port = process.env.LISTEN_PORT;
const router = Router();

function isHex(num: string): boolean {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

const app = express();

router.put("/", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  return res.status(201).send(order);
});

router.use("/:id", (req, res, next) => {
  if (isHex(req.params.id)) return res.sendStatus(400);
  if (req.body._id) return res.sendStatus(400);
  next();
});

router.use("/:id/*", (req, res, next) => {
  if (isHex(req.params.id)) return res.sendStatus(400);
  if (req.body._id) return res.sendStatus(400);
  next();
});

router.get("/:id", async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) return res.sendStatus(404);
  return res.send(order);
});

router.post("/:id", async (req, res) => {
  await Order.updateOne({ _id: req.params.id }, req.body);
  const order = await Order.findOne({ _id: req.params.id });
  return res.send(order);
});

router.delete("/:id", async (req, res) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id });
  if (!order) return res.sendStatus(404);
  return res.send(order);
});

router.post("/:id/suspend", async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) return res.sendStatus(404);
  await order.save();
  return res.send(order);
});

app.use(express.json());
app.use("/", router);
const server = app.listen(listen_port, () => {
  console.log(`App listening on port ${listen_port}`);
});

export default {
  async spawn() {},
  stop() {
    server.close();
    init.then((e) => e.close());
  },
};
