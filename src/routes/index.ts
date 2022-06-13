import express, { Router } from "express";
import { init, Restaurant } from "model";
import items from "./items";
const listen_port = process.env.LISTEN_PORT;
const router = Router();

function isHex(num: string): boolean {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

router.put("/register", async (req, res) => {
  const restaurant = new Restaurant(req.body);
  await restaurant.save();
  return res.status(201).send(restaurant);
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

router.use("/:id/item", items);

router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findOne({ _id: req.params.id });
  if (!restaurant) return res.sendStatus(404);
  return res.send(restaurant);
});

router.post("/:id", async (req, res) => {
  await Restaurant.updateOne({ _id: req.params.id }, req.body);
  const restaurant = await Restaurant.findOne({ _id: req.params.id });
  return res.send(restaurant);
});

router.delete("/:id", async (req, res) => {
  const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id });
  if (!restaurant) return res.sendStatus(404);
  return res.send(restaurant);
});

const app = express();

console.log(`Worker ${process.pid} started`);
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
